import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { UserSession } from '@/types/auth';

const SECRET = process.env.JWT_SECRET as string;
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // Long-lived refresh token

export const generateTokens = (user: UserSession): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, role: user.role },
    SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): UserSession | null => {
  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string; role: 'user' | 'admin' };
    return {
      id: decoded.userId,
      username: '',
      name: '',
      email: '',
      phone: '',
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};

export const setAuthCookies = async (tokens: { accessToken: string; refreshToken: string }, role: 'user' | 'admin'): Promise<void> => {
  (await cookies()).set(`${role}_access_token`, tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  });

  (await cookies()).set(`${role}_refresh_token`, tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
};

export const getAuthTokens = async (role: 'user' | 'admin'): Promise<{ accessToken?: string; refreshToken?: string; }> => {
  return {
    accessToken: (await cookies()).get(`${role}_access_token`)?.value,
    refreshToken: (await cookies()).get(`${role}_refresh_token`)?.value,
  };
};

export const clearAuthCookies = async (role: 'user' | 'admin'): Promise<void> => {
  (await cookies()).delete(`${role}_access_token`);
  (await cookies()).delete(`${role}_refresh_token`);
};

