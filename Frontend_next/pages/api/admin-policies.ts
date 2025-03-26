// pages/api/admin-policies.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { getSession } from 'next-auth/react'; // If using NextAuth.js for session management

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const adminId = session.user?.email; // Assuming the admin's email is used as the identifier

    const client = new MongoClient(process.env.MONGODB_URI!);

    try {
      await client.connect();
      const db = client.db('InsureEase'); // Use your database name
      const policiesCollection = db.collection('policies'); // Use your policies collection name

      // Fetch policies created by the admin
      const policies = await policiesCollection.find({ adminId }).toArray();

      res.status(200).json({ data: policies });
    } catch (error) {
      console.error('Error fetching policies:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}