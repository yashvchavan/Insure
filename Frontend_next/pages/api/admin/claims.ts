import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
const { ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'InsureEase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);

    if (req.method === 'GET') {
      // Get claims for admin
      const { adminEmail } = req.query;
      
      if (!adminEmail) {
        return res.status(400).json({
          success: false,
          message: 'Admin email is required'
        });
      }

      const claims = await db.collection('claims')
        .find({ adminEmail })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({
        success: true,
        claims
      });
    }

    if (req.method === 'PUT') {
      // Update claim status (approve/reject)
      const { claimId, status, reviewNotes, reviewerId } = req.body;
      
      if (!claimId || !status || !reviewerId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const updateData: any = {
        status,
        reviewerId,
        reviewedAt: new Date(),
        updatedAt: new Date()
      };

      if (reviewNotes) {
        updateData.reviewNotes = reviewNotes;
      }

      const result = await db.collection('claims').updateOne(
        { claimId },
        { $set: updateData }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Claim not found or no changes made'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Claim status updated successfully'
      });
    }

  } catch (error: any) {
    console.error('Claims management error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process request'
    });
  }
}