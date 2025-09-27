export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ErrorDetail {
  message: string;
  details?: string;
}

export interface ApiErrorResult extends ErrorDetail {
  canRetry: boolean;
}
