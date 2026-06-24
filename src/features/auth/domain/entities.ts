export interface AuthUser {
  id: string;
  email: string;
  name: string;
  photoURL: string | null;
  createdAt: number;
  lastSeen: number;
  online: boolean;
  about: string;
  username?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}
