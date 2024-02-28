export interface CustomResponse<T> {
  data: T;
  statusCode: number;
  error: any;
}
