// types/adminRegister.ts
export interface AdminRegisterRequest {
    companyName: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    insuranceTypes: string[];
    termsAndConditions: boolean;
  }
  
  export interface AdminRegisterResponse {
    message: string;
    admin?: {
      id: string;
      companyName: string;
      email: string;
      phone: string;
      address: string;
      insuranceTypes: string[];
    };
  }