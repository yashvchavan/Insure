import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
const { ObjectId } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'InsureEase';

interface ApplicationSubmission {
  // Your form fields
  userId: string;
  policyId: string;
  firstName: string;
  lastName: string;
  email: string;
  // ... other fields
  documents: {
    identification: {
      url: string;
      name: string;
      size: number;
      type: string;
    };
    incomeProof: {
      url: string;
      name: string;
      size: number;
      type: string;
    };
    additional?: Array<{
      url: string;
      name: string;
      size: number;
      type: string;
    }>;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);

    const body: ApplicationSubmission = req.body;
    
    // Validate required documents
    if (!body.documents?.identification?.url || !body.documents?.incomeProof?.url) {
      return res.status(400).json({
        success: false,
        message: 'Missing required document references'
      });
    }

    
    const policy = await db.collection('policies').findOne({
      _id: new ObjectId(body.policyId)  
    });
    const adminEmail = typeof policy?.createdBy === 'string' 
    ? policy.createdBy 
    : policy?.createdBy.email;

    const application = {
      ...body,
      adminEmail,
      status: 'submitted',
      applicationId: `APP-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('applications').insertOne(application);

    return res.status(201).json({
      success: true,
      applicationId: application.applicationId,
      submittedOn: application.createdAt.toISOString()
    });

  } catch (error: any) {
    console.error('Submission error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit application'
    });
  }
}