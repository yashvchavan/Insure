// types/adminLogin.ts
export interface AdminLoginRequest {
    email: string;
    password: string;
  }
  
  export interface AdminLoginResponse {
    message: string;
    admin?: {
      id: string;
      email: string;
      name: string;
    };
  }