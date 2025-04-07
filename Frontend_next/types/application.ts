// src/types/application.ts
export interface ApplicationData {
    // Personal Information
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  
    // Professional Information
    occupation: string;
    employmentStatus: string;
    annualIncome: string;
    employerName: string;
    yearsEmployed: string;
  
    // Insurance Details
    coverageAmount: string;
    startDate: string;
    paymentFrequency: string;
    existingConditions: string;
    additionalNotes: string;
  
    // Documents - will store file paths or references
    identificationDocument?: string;
    proofOfIncome?: string;
    additionalDocuments?: string[];
  
    // Terms
    agreeToTerms: boolean;
    allowCommunication: boolean;
  
    // System fields
    applicationId: string;
    status: 'under_review' | 'approved' | 'declined' | 'pending_info';
    policyId?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface FileUploadResponse {
    success: boolean;
    fileUrl: string;
    message?: string;
  }