/**
 * API request and response types
 */

export interface AnalyzeChartRequest {
  image: string; // base64
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
