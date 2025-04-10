// pages/api/user-applications.ts
import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from 'mongodb';

interface Application {
  _id: string;
  userId: string;
  applicationId: string;
  policyId: string;
  startDate: string;
  status: string;
  rejectionReason?: string;
}

interface Policy {
  _id: ObjectId;
  name: string;
  premiumAmount: string;
  // other policy fields...
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db('InsureEase');
    const applicationsCollection = db.collection<Application>('applications');
    const policiesCollection = db.collection<Policy>('policies');

    // Find all applications for this user
    const applications = await applicationsCollection
      .find({ userId: String(userId) })
      .sort({ startDate: -1 })
      .toArray();

    // Get all unique policy IDs
    const policyIds = applications.map(app => new ObjectId(app.policyId));

    // Fetch all related policies in one query
    const policies = await policiesCollection
      .find({ _id: { $in: policyIds } })
      .toArray();

    // Create a policy map for quick lookup
    const policyMap = new Map<string, Policy>();
    policies.forEach(policy => {
      policyMap.set(policy._id.toString(), policy);
    });

    // Enhance applications with policy details
    const enhancedApplications = applications.map(app => {
      const policy = policyMap.get(app.policyId);
      return {
        ...app,
        _id: app._id.toString(),
        policyName: policy?.name,
        premiumAmount: policy?.premiumAmount
      };
    });

    return res.status(200).json({ applications: enhancedApplications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}