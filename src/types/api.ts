export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
  path: string;
  timestamp: string;
}

export interface ApiErrorBody { code?: number; message?: string; error?: string }
