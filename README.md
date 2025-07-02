# Cageflix Project

This monorepo contains the backend and frontend of the Cageflix app — a movie listing platform powered by IMDB data.

<img width="600" alt="Screenshot 2025-07-02 at 18 37 17" src="https://github.com/user-attachments/assets/c9aaa287-b5d5-43a5-81d9-a3d070c43666" />

Frontend - https://cageflix-frontend-85906583d2de.herokuapp.com/

---

## Backend (`/backend`)

### Overview

The backend provides an API built with Node.js and TypeScript. It loads and parses IMDB dataset files and exposes a movie API with pagination, filtering, and search support.

### Features

- REST API for movies
- Fuzzy search (title, description, etc.)
- Genre filtering
- Pagination
- Data loading from IMDB datasets

### Project Structure

```
backend/
├── config/         # App configurations
├── data/           # Parsed movie data (output)
├── imdb/           # Raw IMDB .tsv and .gz files (add manually)
├── routes/         # Express routes
├── scripts/        # Data parsing scripts
├── types/          # TypeScript types
├── server.ts       # Main server entry
└── .env            # Environment variables
```

### Setup

1. **Install dependencies:**

```bash
cd backend
yarn
```

2. **Add IMDB datasets manually:**

Place the required `.tsv` and `.gz` files into the `backend/imdb/` folder.

3. **Configure environment variables:**

Create `.env` file:

```env
OMDB_API_KEY=KEY
```

4. **Run the server:**

```bash
npx ts-node server.ts
```

### API Endpoints

| Method | Endpoint                                  | Description                                      |
|--------|-------------------------------------------|--------------------------------------------------|
| GET    | `/api/movies`                             | Paginated list of movies                         |
| GET    | `/api/movies?page=2&limit=5`              | Second page with limit                           |
| GET    | `/api/movies?q=ghost`                     | Fuzzy search by title/description/etc            |
| GET    | `/api/movies?genre=Action`                | Filter by genre                                  |
| GET    | `/api/movies?q=car&genre=Action&page=1`   | Combined filters and pagination                  |

### Deployment

https://cageflix-api-79d1e8c5813a.herokuapp.com/api/movies

---

## Frontend (`/frontend`)

### Overview

The frontend is a React + Vite + Tailwind app that calls the backend APIs and displays a grid of movies.

### Features

- Movie cards with poster, title, and year
- Infinite scroll (loads more on scroll)
- Responsive layout (mobile-friendly)
- Sticky navigation header
- Filter
- Search

### Tech Stack

- React
- React Router
- Vite
- Tailwind CSS
- TypeScript
- React Query

### Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/   # Header, MovieCard, etc.
│   ├── hooks/        # Custom hooks and React Query hooks
│   ├── pages/        # Route pages (e.g., MoviesPage)
│   └── App.tsx       # Layout and Router wrapper
├── vite.config.ts
└── tailwind.config.js
```

### Setup

1. **Install dependencies:**

```bash
cd frontend
yarn
```

2. **Start dev server:**

```bash
yarn dev
```

Runs at [http://localhost:5173](http://localhost:5173)

### Usage

- The main page shows movies with infinite scroll
- Search and genre filter support (via backend API)

### Deployment

https://cageflix-frontend-85906583d2de.herokuapp.com/

---
