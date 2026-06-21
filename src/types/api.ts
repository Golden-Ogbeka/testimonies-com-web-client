export type Paginated<T> = {
  results: T[];
  totalResults: number;
  resultsPerPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
};


