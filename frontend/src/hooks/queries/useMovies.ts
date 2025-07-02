import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from "@tanstack/react-query";
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

const fetchMovies = async ({
  pageParam = 1,
}: QueryFunctionContext): Promise<MoviesResponse> => {
  const response = await api.get<MoviesResponse>(
    `${endpoints.movies}?page=${pageParam}`
  );
  return response.data;
};

const useMovies = () => {
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<MoviesResponse, Error>({
      queryKey: [QUERY_KEYS.movies],
      queryFn: fetchMovies,
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
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  };
};

export default useMovies;
