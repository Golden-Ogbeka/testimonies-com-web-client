export type PageParams = {
  page?: number;
  limit?: number;
  keyword?: string;
};

export function buildPaginationQuery(params: PageParams = {}): string {
  const sp = new URLSearchParams();
  if (params.page) sp.set('page', String(params.page));
  if (params.limit) sp.set('limit', String(params.limit));
  if (params.keyword) sp.set('keyword', params.keyword);
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}
