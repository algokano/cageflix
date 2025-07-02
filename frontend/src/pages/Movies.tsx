import { useEffect, useRef } from "react";
import { MovieCard } from "../components";
import useMovies from "../hooks/queries/useMovies";

const MoviesPage = () => {
  const { movies, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMovies();

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <div className="text-center mt-10">Loading movies...</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              poster={movie.poster}
              year={movie.year}
            />
          ))}

          {isFetchingNextPage && (
            <div className="col-span-full text-center text-white">
              Loading more...
            </div>
          )}

          {!hasNextPage && (
            <div className="col-span-full text-center text-green-400">
              🎉 You've seen everything!
            </div>
          )}

          {movies.length > 0 && (
            <div ref={observerRef} className="h-1 col-span-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesPage;
