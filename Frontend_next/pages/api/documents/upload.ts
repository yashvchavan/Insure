// pages/api/documents/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import useAuth from '@/context/store';
import multer from 'multer';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { DocumentType, IDocument, UploadDocumentResponse, CloudinaryUploadResult } from '../../../types/document';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// MongoDB connection cache
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

// Define Document Schema
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
});

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema);

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ files: Express.Multer.File[] }> => {
  const multerUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 20 * 1024 * 1024,
    },
  }).array('documents', 10);

  return new Promise((resolve, reject) => {
    multerUpload(req as any, {} as any, (err: any) => {
      if (err) return reject(err);
      resolve({
        files: (req as any).files,
      });
    });
  });
};

const determineDocumentType = (filename: string): DocumentType => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'document';
  return 'other';
};

const uploadToCloudinary = (file: Express.Multer.File, userId: string): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'InsureEase/documents',
        public_id: `${userId}_${Date.now()}_${file.originalname.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve(result as unknown as CloudinaryUploadResult);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadDocumentResponse | { message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || Array.isArray(userId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { files } = await parseForm(req);
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Connect to MongoDB directly in the API route
    await connectToDatabase();

    const uploadedDocuments = [];

    for (const file of files) {
      try {
        const result = await uploadToCloudinary(file, userId);

        const document = await DocumentModel.create({
          user: userId,
          name: file.originalname,
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
          documentType: determineDocumentType(file.originalname),
        });

        uploadedDocuments.push({
          id: document._id.toString(),
          name: document.name,
          url: document.url,
          size: document.size,
          type: document.documentType,
        });
      } catch (error) {
        console.error(`Error uploading file ${file.originalname}:`, error);
      }
    }

    return res.status(201).json({
      message: 'Files uploaded successfully',
      documents: uploadedDocuments,
    });
  } catch (error) {
    console.error('Error in document upload:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Server error during file upload'
    });
  } finally {
    // Don't disconnect - maintain connection for future requests
  }
}