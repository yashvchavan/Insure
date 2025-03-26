// types/register.ts
export interface RegisterRequest {
    username: string;
    name: string;
    email: string;
    password: string;
    phone: string;
  }
  
  export interface RegisterResponse {
    message: string;
    user?: {
      id: string;
      username: string;
      name: string;
      email: string;
      phone: string;
    };
  }