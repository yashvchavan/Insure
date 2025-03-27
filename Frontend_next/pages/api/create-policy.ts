// pages/api/create-policy.ts
import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      name,
      category,
      provider,
      description,
      coverageAmount,
      premium,
      tenureYears,
      features,
      requiredDocuments,
      termsAndConditions,
      isPopular,
      status,
      createdBy,
      subcribers,
      revenue,
    } = req.body;
    console.log('req.body:', req.body);
    // Validate input
    if (
      !name ||
      !category ||
      !provider ||
      !description ||
      !coverageAmount ||
      !premium ||
      !tenureYears ||
      !features ||
      !requiredDocuments ||
      !termsAndConditions ||
      typeof isPopular !== 'boolean' ||
      !status ||
      !createdBy
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Log the MongoDB URI for debugging
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ message: 'MongoDB connection string is missing' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      console.log('Connected to MongoDB');

      const db = client.db('InsureEase'); // Use the `InsureEase` database
      const policiesCollection = db.collection('policies'); // Use the `policies` collection

      // Create a new policy object
      const newPolicy = {
        name,
        category,
        provider,
        description,
        coverageAmount,
        premium,
        tenureYears,
        features,
        requiredDocuments,
        termsAndConditions,
        isPopular,
        status,
        createdBy,
        subcribers,
        revenue,
        createdAt: new Date(),
      };  
      console.log('New Policy:', newPolicy);
      // Insert the new policy into the database
      const result = await policiesCollection.insertOne(newPolicy);
      console.log('Policy inserted:', result.insertedId);

      // Respond with success
      res.status(201).json({ message: 'Policy created successfully', policyId: result.insertedId });
    } catch (error) {
      console.error('Error creating policy:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
      console.log('MongoDB connection closed');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}