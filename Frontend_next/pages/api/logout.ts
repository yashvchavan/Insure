// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Clear the session cookie
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('session', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
          expires: new Date(0), // Expire the cookie immediately
          sameSite: 'strict',
          path: '/',
        })
      );

      // Respond with success and redirect URL
      res.status(200).json({ message: 'Logged out successfully', redirectTo: '/user-login' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}