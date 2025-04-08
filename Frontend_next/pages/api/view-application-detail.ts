import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log('MongoDB URI:', process.env.MONGODB_URI);
  if (!process.env.MONGODB_URI) {
    return res.status(500).json({ error: "MONGODB_URI is not defined" });
  }

  const { applicationId } = req.query;

  if (!applicationId) {
    return res.status(400).json({ error: "Application ID is required" });
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('InsureEase');
    const applicationsCollection = db.collection('applications');

    // Use findOne instead of find to get a single document
    const application = await applicationsCollection.findOne({ 
      applicationId: String(applicationId)  
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Convert to plain object and remove the _id field to avoid serialization issues
    const { _id, ...result } = application;

    return res.status(200).json({ success: true, application: result });
  } catch (error) {
    console.error("Error viewing application:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}