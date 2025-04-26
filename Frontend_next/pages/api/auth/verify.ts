// pages/api/auth/verify.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/services/authService';
import { MongoClient, ObjectId } from 'mongodb';

interface DecodedToken {
  userId: string;
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.access_token;
    
    if (!token) {
      return res.status(200).json({ authenticated: false });
    }

    // Verify and type cast the decoded token
    const decoded = verifyToken(token) as unknown as DecodedToken;
    
    if (!decoded?.userId) {
      return res.status(200).json({ authenticated: false });
    }

    // Verify user exists in database
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    
    try {
      const db = client.db('InsureEase');
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(decoded.userId) 
      });

      if (!user) {
        return res.status(200).json({ authenticated: false });
      }

      // Return minimal user data
      return res.status(200).json({ 
        authenticated: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          name: user.name,
          email: user.email
        }
      });
    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(200).json({ authenticated: false });
  }
}