import fs from "fs";
import path from "path";
import { parse } from "fast-csv";
import { IMDB_PATH, NAME_FILE, PRINCIPALS_FILE } from "../imdb/constants";
import { config } from "../config";
import { Movie } from "../types";

// Load cage_movies.json
const movieDataPath = path.join(__dirname, "..", config.dataPath);
const movies: Movie[] = JSON.parse(fs.readFileSync(movieDataPath, "utf-8"));

// actor links
const getMovieActorMap = async (): Promise<Record<string, string[]>> => {
  return new Promise((resolve) => {
    const map: Record<string, string[]> = {};

    fs.createReadStream(path.join(IMDB_PATH, PRINCIPALS_FILE))
      .pipe(parse({ headers: true, delimiter: "\t", quote: null }))
      .on("data", (row) => {
        const { tconst, nconst, category, ordering } = row;

        if (!["actor", "actress"].includes(category)) return;

        if (!map[tconst]) {
          map[tconst] = [];
        }

        // Keep actors ordered by billing position
        map[tconst].push(nconst);
      })
      .on("end", () => resolve(map));
  });
};

//load names
const getNameMap = async (): Promise<Record<string, string>> => {
  return new Promise((resolve) => {
    const nameMap: Record<string, string> = {};

    fs.createReadStream(path.join(IMDB_PATH, NAME_FILE))
      .pipe(parse({ headers: true, delimiter: "\t", quote: null }))
      .on("data", (row) => {
        nameMap[row.nconst] = row.primaryName;
      })
      .on("end", () => resolve(nameMap));
  });
};

const enrichWithActors = async () => {
  console.log("Enriching movies with actors...");

  const [movieActorMap, nameMap] = await Promise.all([
    getMovieActorMap(),
    getNameMap(),
  ]);

  const enriched = movies.map((movie) => {
    const actorIds = movieActorMap[movie.id] || [];
    const topActors = actorIds
      .slice(0, 3)
      .map((nconst) => nameMap[nconst])
      .filter(Boolean);

    return {
      ...movie,
      actors: topActors,
    };
  });

  fs.writeFileSync(movieDataPath, JSON.stringify(enriched, null, 2), "utf-8");
  console.log(`Enriched ${enriched.length} movies with actors`);
};

enrichWithActors();
