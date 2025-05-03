import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
const { ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'InsureEase';

interface ClaimSubmission {
  userId: string;
  policyId: string;
  policyName: string;
  insuranceCompany: string;
  incidentDate: string;
  claimAmount: string;
  description: string;
  documents: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>;
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

    const body: ClaimSubmission = req.body;
    
    // Validate required documents
    if (!body.documents || body.documents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one supporting document is required'
      });
    }

    // Get policy details to find admin email
    const policy = await db.collection('policies').findOne({
      _id: new ObjectId(body.policyId)  
    });
    
    const adminEmail = typeof policy?.createdBy === 'string' 
      ? policy.createdBy 
      : policy?.createdBy.email;

    const claim = {
      ...body,
      adminEmail,
      status: 'submitted',
      claimId: `CL-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      reviewNotes: '',
      reviewerId: null,
      reviewedAt: null
    };

    const result = await db.collection('claims').insertOne(claim);

    return res.status(201).json({
      success: true,
      claimId: claim.claimId,
      submittedOn: claim.createdAt.toISOString()
    });

  } catch (error: any) {
    console.error('Claim submission error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit claim'
    });
  }
}