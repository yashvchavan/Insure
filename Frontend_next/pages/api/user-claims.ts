import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'InsureEase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);

    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const claims = await db.collection('claims')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      claims
    });

  } catch (error: any) {
    console.error('User claims fetch error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user claims'
    });
  }
}