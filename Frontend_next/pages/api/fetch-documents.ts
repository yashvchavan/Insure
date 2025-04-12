import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

// Define the Document interface
interface IDocument extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  name: string;
  url: string;
  publicId: string;
  format: string;
  size: number;
  documentType: 'image' | 'pdf' | 'document' | 'other';
  uploadedAt: Date;
}

// Document Schema
const documentSchema = new mongoose.Schema<IDocument>({
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
}, { collection: 'documents' }); // Explicitly set collection name

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

// Create or get the Document model
async function getDocumentModel() {
  const db = await connectToDatabase();
  return db.models.Document || db.model<IDocument>('Document', documentSchema);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: 'Valid user ID is required' });
      }

      const DocumentModel = await getDocumentModel();
      
      const documents = await DocumentModel.find({ user: new mongoose.Types.ObjectId(userId) })
        .sort({ uploadedAt: -1 })
        .lean<IDocument[]>()
        .exec();

      return res.status(200).json(documents.map(doc => ({
        id: (doc as any)._id.toString(),
        name: doc.name,
        url: doc.url,
        size: doc.size,
        type: doc.documentType,
        uploadedAt: doc.uploadedAt,
      })));
    } catch (error) {
      console.error('Error fetching documents:', error);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}