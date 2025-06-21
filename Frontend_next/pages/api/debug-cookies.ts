import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get all cookies from the request
    const cookies = req.cookies;
    
    // Get headers that might affect cookies
    const headers = {
      host: req.headers.host,
      'user-agent': req.headers['user-agent'],
      'accept': req.headers.accept,
      'accept-language': req.headers['accept-language'],
      'sec-fetch-site': req.headers['sec-fetch-site'],
      'sec-fetch-mode': req.headers['sec-fetch-mode'],
      'sec-fetch-dest': req.headers['sec-fetch-dest'],
    };

    // Environment information
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    };

    // Test setting a cookie
    const testCookieOptions = {
      httpOnly: false, // Make it readable for debugging
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax' as const,
    };

    res.setHeader('Set-Cookie', `debug_cookie=test_value_${Date.now()}; HttpOnly=false; Path=/; Max-Age=3600; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

    return res.status(200).json({
      message: 'Debug information',
      cookies,
      headers,
      environment: env,
      timestamp: new Date().toISOString(),
      testCookieSet: true
    });

  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 