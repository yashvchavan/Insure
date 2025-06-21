// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    // Determine if we're in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Get the host from the request headers
    const host = req.headers.host || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    
    // Base cookie options for clearing
    const baseCookieOptions = {
      httpOnly: true,
      secure: isProduction && !isLocalhost,
      expires: new Date(0), // Expire immediately
      path: '/',
      sameSite: 'lax' as const, // Match login configuration
    };

    // Clear all auth cookies
    const cookies = [
      serialize('access_token', '', baseCookieOptions),
      serialize('refresh_token', '', baseCookieOptions),
      serialize('auth_state', '', {
        ...baseCookieOptions,
        httpOnly: false // Match login configuration
      })
    ];

    res.setHeader('Set-Cookie', cookies);
    return res.status(200).json({ message: 'Logout successful' });
    
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}