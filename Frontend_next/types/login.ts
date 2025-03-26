// types/login.ts
export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    message: string;
    user?: {
      id: string;
      username: string;
      name: string;
      email: string;
      phone: string;
    };
    token?: string; // If using JWT for authentication
  }