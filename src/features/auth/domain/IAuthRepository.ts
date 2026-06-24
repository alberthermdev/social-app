import { AuthUser, LoginParams, RegisterParams } from '@/features/auth/domain/entities';

export interface IAuthRepository {
  login(params: LoginParams): Promise<AuthUser>;
  register(params: RegisterParams): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  sendPasswordReset(email: string): Promise<void>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}
