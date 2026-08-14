export interface ApiResponse<T = unknown> {
  status: string;
  message: string;
  data?: T;
  pagination? : Pagination
}

export interface Pagination {
  page : number,
  limit : number,
  totalRecords : number,
  totalPage : number
  hasNextPage : boolean,
  hasPreviousPage : boolean
}
