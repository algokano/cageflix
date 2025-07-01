import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { Movie } from "../types";

const OMDB_API_KEY = "8e78e5c5";
const INPUT_PATH = path.join(__dirname, "..", "data", "cage_movies.json");
const OUTPUT_PATH = INPUT_PATH;

interface OmdbResponse {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;
  Response: "True" | "False";
  Error?: string;
}

const BASE_URL = "https://www.omdbapi.com";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const enrich = async () => {
  const raw = fs.readFileSync(INPUT_PATH, "utf-8");
  const movies: Movie[] = JSON.parse(raw);

  const enriched: Movie[] = [];

  for (const movie of movies) {
    const url = `${BASE_URL}/?i=${movie.id}&apikey=${OMDB_API_KEY}`;
    try {
      const res = await fetch(url);
      const data = (await res.json()) as OmdbResponse;

      enriched.push({
        ...movie,
        description: data.Plot || "",
        poster: data.Poster || "",
      });

      console.log(`Enriched: ${movie.title}`);
    } catch (err) {
      console.warn(`-Failed for ${movie.title}`);
      enriched.push({ ...movie });
    }

    await delay(500); // prevent rate-limiting
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(enriched, null, 2), "utf-8");
  console.log(`${enriched.length} movies saved to cage_movies.json`);
};

enrich();
