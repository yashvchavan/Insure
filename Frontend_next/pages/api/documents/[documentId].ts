import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Document Schema (same as above)
const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  documentType: {
    type: String,
    enum: ['image', 'pdf', 'document', 'other'],
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Database connection cache
let cachedDb: mongoose.Connection | null = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!process.env.MONGODB_URI || !process.env.MONGODB_DB) {
    throw new Error('MongoDB configuration missing in environment variables');
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB,
  });

  cachedDb = connection.connection;
  return cachedDb;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { documentId } = req.query;
    const { userId } = req.query;

    if (!documentId || typeof documentId !== 'string' || 
        !userId || typeof userId !== 'string') {
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    const db = await connectToDatabase();
    const DocumentModel = db.models.Document || db.model('Document', documentSchema);

    const document = await DocumentModel.findOneAndDelete({ 
      _id: documentId, 
      user: userId 
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from Cloudinary
    await cloudinary.v2.uploader.destroy(document.publicId);

    return res.status(200).json({ message: 'Document deleted' });
  } catch (error) {
    console.error('Error deleting document:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}