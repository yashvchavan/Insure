import { MongoClient,ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ 
      success: false, 
      error: "User ID and password required" 
    });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 1 } }
    );

    client.close();

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false, 
        error: "Incorrect password" 
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error verifying password:', error);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to verify password" 
    });
  }
}