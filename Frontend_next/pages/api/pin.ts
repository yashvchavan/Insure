import { MongoClient, ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';
const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, pin } = req.body;

    try {
      const client = await MongoClient.connect(uri);
      const db = client.db(dbName);
      
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { vaultPin: pin } },
        { upsert: true }
      );

      client.close();
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating PIN:', error);
      return res.status(500).json({ success: false, error: "Failed to update PIN" });
    }
  } 
  else if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID required" });
    }

    try {
      const client = await MongoClient.connect(uri);
      const db = client.db(dbName);
      
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(userId as string) },
        { projection: { vaultPin: 1 } }
      );

      client.close();
      
      return res.status(200).json({ 
        success: true, 
        pin: user?.vaultPin || null 
      });
    } catch (error) {
      console.error('Error fetching PIN:', error);
      return res.status(500).json({ success: false, error: "Failed to fetch PIN" });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}