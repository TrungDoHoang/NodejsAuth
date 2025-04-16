import { Request } from "express";

export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  refreshToken: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleAttributes {
  id: string;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRoleAttributes {
  id: string;
  userId: string;
  roleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    roles?: string[];
  };
}

export interface TokenPayload {
  userId: string;
  roles?: string[];
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
