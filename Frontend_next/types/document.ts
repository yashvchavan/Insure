// types/document.ts
import { Types } from "mongoose";

export type DocumentType = "image" | "pdf" | "document" | "other";

export interface IDocument {
  id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  url: string;
  publicId: string;
  format: string;
  size: number;
  documentType: DocumentType;
  uploadedAt: Date;
}

export interface UploadDocumentResponse {
  message: string;
  documents: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: DocumentType;
  }[];
}

export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
}