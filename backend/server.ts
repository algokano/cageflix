import express from "express";
import cors from "cors";
import moviesRoute from "./routes/movies";
import { config } from "./config";

const app = express();

app.use(cors());
app.use("/api/movies", moviesRoute);

app.listen(config.port, () => {
  console.log(
    `Cageflix API running at http://localhost:${config.port}/api/movies`
  );
});
