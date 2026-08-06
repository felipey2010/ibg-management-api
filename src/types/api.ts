export type PaginationQuery = {
  page?: number;
  limit?: number;
};

export type RequestContext = {
  userId?: string;
  role?: string;
};
