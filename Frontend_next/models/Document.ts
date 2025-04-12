// models/Document.ts
import { Schema, model, models, Document as MongooseDocument } from 'mongoose';
import { DocumentType } from '../types/document';

export interface IDocument extends MongooseDocument {
  user: Schema.Types.ObjectId;
  name: string;
  url: string;
  publicId: string;
  format: string;
  size: number;
  documentType: DocumentType;
  uploadedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  user: {
    type: Schema.Types.ObjectId,
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

export default models.Document || model<IDocument>('Document', DocumentSchema);