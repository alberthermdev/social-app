import { IAuthRepository } from '@/features/auth/domain/IAuthRepository';
import { AuthUser, LoginParams, RegisterParams } from '@/features/auth/domain/entities';

export function createAuthUseCases(repository: IAuthRepository) {
  return {
    login: (params: LoginParams): Promise<AuthUser> => repository.login(params),
    register: (params: RegisterParams): Promise<AuthUser> => repository.register(params),
    logout: (): Promise<void> => repository.logout(),
    getCurrentUser: (): Promise<AuthUser | null> => repository.getCurrentUser(),
    sendPasswordReset: (email: string): Promise<void> => repository.sendPasswordReset(email),
    onAuthStateChanged: (callback: (user: AuthUser | null) => void): (() => void) =>
      repository.onAuthStateChanged(callback),
  };
}

export type AuthUseCases = ReturnType<typeof createAuthUseCases>;
