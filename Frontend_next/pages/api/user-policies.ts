import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient, ObjectId } from 'mongodb';

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
    const applicationsCollection = db.collection('applications');
    const policiesCollection = db.collection('policies');

    // Find approved applications for this user
    const approvedApplications = await applicationsCollection
      .find({ 
        userId: String(userId),
        status: "approved"
      })
      .toArray();

    if (approvedApplications.length === 0) {
      return res.status(200).json({ policies: [] });
    }

    // Get policy details for each approved application
    const userPolicies = await Promise.all(
      approvedApplications.map(async (app) => {
        const policy = await policiesCollection.findOne({ 
          _id: new ObjectId(app.policyId) 
        });
        
        if (!policy) {
          console.warn(`Policy not found for ID: ${app.policyId}`);
          return null;
        }

        return {
          _id: app._id.toString(),
          policyId: app.policyId,
          name: policy.name,
          type: policy.category,
          premium: policy.premiumAmount,
          renewalDate: app.startDate ? 
            new Date(app.startDate).toISOString().split('T')[0] : 
            "N/A",
          status: "Active",
          coverageAmount: policy.coverageAmount,
          startDate: app.startDate
        };
      })
    );

    // Filter out any null entries from missing policies
    const validPolicies = userPolicies.filter(policy => policy !== null);

    return res.status(200).json({ policies: validPolicies });
  } catch (error) {
    console.error("Error fetching policies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}