import { Router } from "express";
import fs from "fs";
import path from "path";
import Fuse from "fuse.js";
import { config } from "../config";
import { Movie } from "../types";

const router = Router();

const raw = fs.readFileSync(
  path.join(__dirname, "..", config.dataPath),
  "utf-8"
);
const movies: Movie[] = JSON.parse(raw);

const fuse = new Fuse(movies, {
  keys: ["title", "description", "genres", "actors"],
  threshold: 0.3,
});

router.get("/", (req, res) => {
  const { page = 1, limit = config.defaultPageSize, q = "", genre } = req.query;

  let filtered = movies;

  // Fuzzy search
  if (q && typeof q === "string") {
    const result = fuse.search(q);
    filtered = result.map((r) => r.item);
  }

  // Filter by genre
  if (genre && typeof genre === "string") {
    filtered = filtered.filter((m) => m.genres.includes(genre));
  }

  // Pagination
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;

  res.json({
    total: filtered.length,
    page: pageNum,
    limit: limitNum,
    results: filtered.slice(start, end),
  });
});

export default router;
