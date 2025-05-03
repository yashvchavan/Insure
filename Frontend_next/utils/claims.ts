// utils/claims.ts
import { 
    Clock, 
    AlertCircle, 
    CheckCircle, 
    XCircle, 
    DollarSign, 
    FileText 
  } from "lucide-react";
  
  // utils/claims.ts
export const getClaimStatusColor = (status: string): string => {
  switch (status) {
    case 'submitted':
      return 'bg-blue-100 text-blue-800';
    case 'in-review':
      return 'bg-amber-100 text-amber-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'paid':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getClaimStatusIconName = (status: string): string => {
  switch (status) {
    case 'submitted':
      return 'Clock';
    case 'in-review':
      return 'AlertCircle';
    case 'approved':
      return 'CheckCircle';
    case 'rejected':
      return 'XCircle';
    case 'paid':
      return 'DollarSign';
    default:
      return 'FileText';
  }
};

export const getClaimStatusIconClass = (status: string): string => {
  switch (status) {
    case 'submitted':
      return 'text-blue-500';
    case 'in-review':
      return 'text-amber-500';
    case 'approved':
      return 'text-green-500';
    case 'rejected':
      return 'text-red-500';
    case 'paid':
      return 'text-purple-500';
    default:
      return 'text-gray-500';
  }
};