// services/documentService.ts
import { Import } from 'lucide-react';
import { UploadDocumentResponse, IDocument } from '../types/document';
export const uploadDocuments = async (files: File[], userId: string): Promise<UploadDocumentResponse> => {
    const formData = new FormData();

    files.forEach(file => {
        formData.append('documents', file);
    });

    const response = await fetch(`/api/documents/upload?userId=${userId}`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload documents');
    }

    return response.json();
};

  export const fetchDocuments = async (userId: string): Promise<IDocument[]> => {
    const response = await fetch(`/api/fetch-documents?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  };

// Add to documentService.ts
export const deleteDocument = async (documentId: string, userId: string) => {
    const response = await fetch(`/api/documents/${documentId}?userId=${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete document');
    }
    return response.json();
  };
  
  