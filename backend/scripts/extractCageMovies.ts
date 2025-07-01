import fs from "fs";
import path from "path";
import { parse } from "fast-csv";
import {
  IMDB_PATH,
  NAME_FILE,
  PRINCIPALS_FILE,
  TITLES_FILE,
  CAGE_NAME,
} from "../imdb/constants";

const OUTPUT_PATH = path.join(__dirname, "..", "data", "cage_movies.json");

const parserOptions = { headers: true, delimiter: "\t", quote: null };

// Find Nicolas' ID
const getNicolasCageId = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    fs.createReadStream(path.join(IMDB_PATH, NAME_FILE))
      .pipe(parse(parserOptions))
      .on("data", (row) => {
        if (row.primaryName === CAGE_NAME) {
          resolve(row.nconst);
        }
      })
      .on("end", () => resolve(null));
  });
};

// Find all title IDs he appeared in
const getCageTitles = async (nconst: string): Promise<Set<string>> => {
  return new Promise((resolve) => {
    const titles = new Set<string>();

    fs.createReadStream(path.join(IMDB_PATH, PRINCIPALS_FILE))
      .pipe(parse(parserOptions))
      .on("data", (row) => {
        if (row.nconst === nconst && row.category === "actor") {
          titles.add(row.tconst);
        }
      })
      .on("end", () => resolve(titles));
  });
};

// Get title details
const getTitleDetails = async (titleSet: Set<string>) => {
  return new Promise<any[]>((resolve) => {
    const result: any[] = [];

    fs.createReadStream(path.join(IMDB_PATH, TITLES_FILE))
      .pipe(parse(parserOptions))
      .on("data", (row) => {
        if (
          titleSet.has(row.tconst) &&
          row.titleType.match(/movie|tvSeries|tvMovie/) &&
          row.isAdult === "0"
        ) {
          result.push({
            id: row.tconst,
            title: row.primaryTitle,
            year: row.startYear,
            genres: row.genres.split(","),
            type: row.titleType,
            runtime: row.runtimeMinutes,
          });
        }
      })
      .on("end", () => resolve(result));
  });
};

const main = async () => {
  console.log(`Looking up ${CAGE_NAME}...`);
  const cageId = await getNicolasCageId();
  if (!cageId) {
    console.error(`Could not find ${CAGE_NAME}`);
    return;
  }

  console.log("Finding Cage titles...");
  const titles = await getCageTitles(cageId);

  console.log("Extracting movie details...");
  const movieData = await getTitleDetails(titles);

  console.log(`Writing ${movieData.length} results to cage_movies.json`);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(movieData, null, 2), "utf-8");
};

main();
