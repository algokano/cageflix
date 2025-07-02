import { useInfiniteQuery } from "@tanstack/react-query";
import type { Movie } from "../../types";
import api from "../../api";
import { QUERY_KEYS } from "./queryKeys";
import endpoints from "../../api/endpoints";

interface MoviesResponse {
  total: number;
  page: number;
  limit: number;
  results: Movie[];
}

type Params = {
  pageParam: number;
  searchTerm?: string;
};

const fetchMovies = async ({
  pageParam = 1,
  searchTerm = "",
}: Params): Promise<MoviesResponse> => {
  const query = searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : "";
  const response = await api.get<MoviesResponse>(
    `${endpoints.movies}?page=${pageParam}${query}`
  );
  return response.data;
};

const useMovies = (searchTerm: string) => {
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<MoviesResponse, Error>({
      queryKey: [QUERY_KEYS.movies, searchTerm],
      queryFn: ({ pageParam }) =>
        fetchMovies({ pageParam: pageParam as number, searchTerm }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const totalPages = Math.ceil(lastPage.total / lastPage.limit);
        const nextPage = allPages.length + 1;
        return nextPage <= totalPages ? nextPage : undefined;
      },
    });

  return {
    movies: data?.pages.flatMap((page) => page.results) ?? [],
    isLoading: isFetching && !data,
    total: data?.pages[0]?.total ?? 0,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};

export default useMovies;
