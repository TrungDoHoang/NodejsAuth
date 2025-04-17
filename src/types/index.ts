import { Request } from "express";
import { Optional } from "sequelize";

export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  refreshToken: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "isActive"> {}

export interface RoleAttributes {
  id: string;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRoleAttributes {
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

export interface IPaginationQuery {
  page?: string;
  perPage?: string;
}
