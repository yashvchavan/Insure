import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { UserSession } from '@/types/auth';
import { generateTokens, getAuthTokens, setAuthCookies } from '@/services/authService';

const SECRET = process.env.JWT_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { role } = req.body;
    const tokens = await getAuthTokens(role as 'user' | 'admin');
    
    if (!tokens.refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    const decoded = jwt.verify(tokens.refreshToken, SECRET) as { userId: string; role: 'user' | 'admin' };
    
    // In a real app, you would verify the user exists in DB
    const userSession: UserSession = {
      id: decoded.userId,
      username: '',
      name: '',
      email: '',
      phone: '',
      role: decoded.role,
    };

    const newTokens = generateTokens(userSession);
    setAuthCookies(newTokens, decoded.role);

    res.status(200).json({ accessToken: newTokens.accessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}