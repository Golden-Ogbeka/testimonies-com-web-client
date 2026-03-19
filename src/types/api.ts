export type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  code?: string;
  requestId?: string;
};

export type Paginated<T> = {
  results: T[];
  totalResults: number;
  resultsPerPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
};

export type Nullable<T> = T | null;
