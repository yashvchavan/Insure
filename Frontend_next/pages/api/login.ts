// pages/api/login.ts
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { LoginRequest, LoginResponse } from '@/types/login';

const JWT_SECRET = process.env.JWT_SECRET as string;
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 7 days

// Add at the start of your handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { username, password } = req.body as LoginRequest;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: 'MongoDB connection string is missing' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    try {
      const db = client.db('InsureEase');
      const usersCollection = db.collection('users');

      // Find user by username
      const user = await usersCollection.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Create user session without password
      const userSession = {
        id: user._id.toString(),
        username: user.username,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: 'user' as const,
      };

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { userId: userSession.id, role: userSession.role },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
      );

      const refreshToken = jwt.sign(
        { userId: userSession.id, role: userSession.role },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
      );

      // Determine if we're in production
      const isProduction = process.env.NODE_ENV === 'production';
      
      // Get the host from the request headers
      const host = req.headers.host || '';
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
      
      // Base cookie options
      const baseCookieOptions = {
        httpOnly: true,
        secure: isProduction && !isLocalhost, // Only secure in production and not localhost
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        sameSite: 'lax' as const, // Changed from 'strict' to 'lax' for better compatibility
      };

      // Set domain only in production and not for localhost
      const cookieOptions = isProduction && !isLocalhost 
        ? { ...baseCookieOptions, domain: undefined } // Let the browser set the domain automatically
        : baseCookieOptions;

      // Set HTTP-only cookies
      res.setHeader('Set-Cookie', [
        serialize('access_token', accessToken, cookieOptions),
        serialize('refresh_token', refreshToken, cookieOptions),
        serialize('auth_state', 'authenticated', {
          ...cookieOptions,
          httpOnly: false // Allow client-side reading
        })
      ]);

      // Return success response
      return res.status(200).json({
        message: 'Login successful',
        user: userSession,
        token: accessToken // For client-side usage if needed
      });

    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}