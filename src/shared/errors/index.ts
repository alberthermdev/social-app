export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code);
    this.name = 'AuthError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error. Please check your connection.') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;

  const firebaseError = error as { code?: string; message?: string };
  switch (firebaseError.code) {
    case 'auth/user-not-found':
      return 'No user found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password is too weak';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return firebaseError.message || 'An unexpected error occurred';
  }
}
