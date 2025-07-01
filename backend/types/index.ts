export interface Movie {
  id: string;
  title: string;
  year: string;
  genres: string[];
  type: string;
  runtime: string;
  description: string;
  poster: string;
  actors?: string[];
}
