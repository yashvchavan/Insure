import { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from 'mongodb';
import { getSession } from "next-auth/react"; // If using next-auth for authentication

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  console.log('MongoDB URI:', process.env.MONGODB_URI);
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  const { email } = req.query; 

  try {

    await client.connect(); // Connect to MongoDB
    console.log('Connected to MongoDB');
    // Retrieve the email from session storage (frontend must send it via query or headers)

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Fetch policies where CreatedBy.email matches the given email
    const db = client.db('InsureEase'); // Use the `InsureEase` database
    const policiesCollection = db.collection('applications'); // Use the `policies` collection


      // Find the admin by email
      const application = await policiesCollection.find({ 
        "adminEmail": String(email)  
      }).project({
        applicationId: 1,
        userId: 1,
        policyId: 1,
        startDate: 1,
        email: 1,
        status:1,
      }).toArray();

      if (!application || application.length === 0) {
        return res.status(400).json({ message: 'No policy for admin' });
      }
      console.log("adminpolicyGET : ",application);
    return res.status(200).json({ success: true, application });
  } catch (error) {
    console.error("Error fetching policies:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
