import { useEffect, useRef } from "react";
import { MovieCard } from "../components";
import useMovies from "../hooks/queries/useMovies";
import { useOutletContext } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

interface OutletContext {
  searchTerm: string;
}

const MoviesPage = () => {
  const { searchTerm } = useOutletContext<OutletContext>();
  const debouncedSearch = useDebounce(searchTerm, 400);
  const {
    movies,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    total,
  } = useMovies(debouncedSearch);

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
        {movies.length !== 0 && (
          <div className="col-span-full text-center text-gray-400 mb-4">
            {total} movies found {searchTerm ? `for "${searchTerm}"` : ""}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              poster={movie.poster}
              year={movie.year}
              genres={movie.genres}
              description={movie.description}
              actors={movie.actors}
            />
          ))}

          {isFetchingNextPage && (
            <div className="col-span-full text-center text-white">
              Loading more...
            </div>
          )}

          {!hasNextPage && movies?.length > 0 && (
            <div className="col-span-full text-center text-green-400">
              🎉 You've seen everything!
            </div>
          )}

          {movies.length === 0 && (
            <div className="col-span-full text-center text-white">
              No movies found for "{searchTerm}".
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
