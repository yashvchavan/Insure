// pages/api/auth/check.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/services/authService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.access_token;
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = verifyToken(token);
    return res.status(200).json({ 
      authenticated: true,
      user: decoded 
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
}