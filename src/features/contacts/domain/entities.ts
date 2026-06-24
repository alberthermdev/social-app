import { AuthUser } from '@/features/auth/domain/entities';

export type ContactUser = Pick<AuthUser, 'id' | 'name' | 'email' | 'photoURL' | 'online' | 'lastSeen' | 'about'>;
