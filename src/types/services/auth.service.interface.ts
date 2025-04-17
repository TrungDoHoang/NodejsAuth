import { ChangePasswordDto, LoginDto, RegisterDto } from "@/dtos/auth.dto";
import { RoleAttributes } from "@/types";
import { IUser } from "./user.service.interface";

export interface IAuthService {
  /**
   * Register a new user
   * @param registerDto User registration data
   */
  register(registerDto: RegisterDto): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }>;

  /**
   * Login a user
   * @param loginDto User login credentials
   */
  login(loginDto: LoginDto): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }>;

  /**
   * Get user profile by user ID
   * @param userId User ID
   */
  getProfile(userId: number): Promise<{
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    roles: RoleAttributes[];
    createdAt: Date;
    updatedAt: Date;
  }>;

  /**
   * Logout a user
   * @param userId User ID
   */
  logout(userId: number): Promise<boolean>;

  /**
   * Refresh authentication tokens
   * @param refreshToken Current refresh token
   */
  refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;

  /**
   * Change user password
   * @param userId User ID
   * @param changePasswordDto Password change data
   */
  changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto
  ): Promise<boolean>;
}
