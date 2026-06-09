// types/user.ts
export interface AuthSession {
  success: boolean;
  message: string;
  user: {
    id?: string;
    _id?: string;
    phone: string;
    name: string | null;
    email: string | null;
    isVerified: boolean;
    verifiedAt?: string;
  };
  token: string;
}

export interface User {
  id: string;
  _id: string;
  phone: string;
  name: string | null;
  email: string | null;
  isVerified: boolean;
  verifiedAt?: string;
}