export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
