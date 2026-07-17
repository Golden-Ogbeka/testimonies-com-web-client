export type Paginated<T> = {
  results: T[];
  totalResults: number;
  resultsPerPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

export type SearchUsersResponse = {
  users: import('./auth').User[];
  organizations: Record<string, unknown>[];
};

export type FollowRequestsResponse = {
  followRequests: import('./domain').FollowRequest[];
  totalResults: number;
  resultsPerPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
};

export type SessionItem = {
  _id: string;
  userId?: string;
  expiresAt?: string;
  ipAddress?: string;
  city?: string;
  region?: string;
  country?: string;
  userAgent?: string;
  deviceType?: string;
  deviceOS?: string;
  deviceOSVersion?: string;
  deviceModel?: string;
  deviceManufacturer?: string;
  createdAt?: string;
};
