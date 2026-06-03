export interface ApiResponse<T = unknown> {
  status: 'success' | 'failed';
  description: string;
  data?: T;
}
