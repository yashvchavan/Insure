// pages/api/approve-application.ts
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { applicationId } = req.body;

  if (!applicationId) {
    return res.status(400).json({ error: "Application ID is required" });
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db('InsureEase');
    const applicationsCollection = db.collection('applications');

    const result = await applicationsCollection.updateOne(
      { applicationId: applicationId },
      { $set: { status: "approved" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Application not found or already approved' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error approving application:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}