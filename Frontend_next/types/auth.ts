// Consolidate all auth-related types
export * from './adminLogin';
export * from './adminRegister';
export * from './login';
export * from './register';

export interface UserSession {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string; // Optional for future refresh token implementation
}