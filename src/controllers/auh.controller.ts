import i18next from "@/config/i18n";
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from "@/dtos/auth.dto";
import { HttpException } from "@/exceptions/http.exception";
import { AuthService } from "@/services/auth.service";
import { Request, Response } from "express";

/**
 * Controller handling authentication-related operations
 * Provides methods for user registration, login, token refresh, logout, profile retrieval, and password changes
 * Uses AuthService for core authentication logic and handles HTTP request/response processing
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Handles user registration by processing registration request
   * @async
   * @param {Request} req - Express request object containing registration data
   * @param {Response} res - Express response object for sending registration result
   * @returns {Promise<Response>} HTTP response with registration status and user details
   * @throws {Error} Throws error if registration fails, with appropriate HTTP status code
   */
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.authService.register(req.body as RegisterDto);

      return res.status(201).json({
        success: true,
        message: i18next.t("auth.success.registered"),
        ...result,
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: i18next.t(error.message),
        });
      }

      return res.status(500).json({
        success: false,
        message: i18next.t("errors.server.internal"),
        error: error.message,
      });
    }
  };

  /**
   * Handles user login by processing login request
   * @async
   * @param {Request} req - Express request object containing login data
   * @param {Response} res - Express response object for sending login result
   * @returns {Promise<Response>} HTTP response with login status and user details
   * @throws {Error} Throws error if login fails, with appropriate HTTP status code
   */
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.authService.login(req.body as LoginDto);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Login error:", error);

      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: i18next.t(error.message),
        });
      }

      return res.status(500).json({
        success: false,
        message: i18next.t("errors.server.internal"),
        error: error.message,
      });
    }
  };

  /**
   * Handles token refresh by processing a refresh token request
   * @async
   * @param {Request} req - Express request object containing refresh token
   * @param {Response} res - Express response object for sending new tokens
   * @returns {Promise<Response>} HTTP response with new access and refresh tokens
   * @throws {Error} Throws error if token refresh fails, with appropriate HTTP status code
   */
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body as RefreshTokenDto;
      const result = await this.authService.refreshToken(refreshToken);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Token refresh error:", error);

      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res.status(401).json({
          success: false,
          message: i18next.t("errors.auth.invalidOrExpiredToken"),
        });
      }

      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: i18next.t(error.message),
        });
      }

      return res.status(500).json({
        success: false,
        message: i18next.t("errors.server.internal"),
        error: error.message,
      });
    }
  };

  /**
   * Handles user logout by invalidating the user's session
   * @async
   * @param {Request} req - Express request object containing authenticated user information
   * @param {Response} res - Express response object for sending logout status
   * @returns {Promise<Response>} HTTP response indicating successful logout or error
   * @throws {Error} Throws error if logout process fails, with appropriate HTTP status code
   */
  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.authService.logout((req as any).user.userId);

      if (!result) {
        throw new Error();
      }

      return res.status(200).json({
        success: true,
        message: i18next.t("success.loggedOut"),
      });
    } catch (error) {
      console.error("Logout error:", error);

      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: i18next.t(error.message),
        });
      }

      return res.status(500).json({
        success: false,
        message: "An error occurred during logout",
        error: error.message,
      });
    }
  };

  /**
   * Retrieves the authenticated user's profile information
   * @async
   * @param {Request} req - Express request object containing authenticated user information
   * @param {Response} res - Express response object for sending user profile data
   * @returns {Promise<Response>} HTTP response with user profile details or error status
   * @throws {Error} Throws error if profile retrieval fails, with appropriate HTTP status code
   */
  getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.authService.getProfile(
        (req as any).user?.userId
      );

      return res.status(200).json({
        success: true,
        user: result,
      });
    } catch (error) {
      console.error("Get profile error:", error);

      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: i18next.t(error.message),
        });
      }

      return res.status(500).json({
        success: false,
        message: i18next.t("errors.server.internal"),
        error: error.message,
      });
    }
  };

  /**
   * Changes the authenticated user's password
   * @async
   * @param {Request} req - Express request object containing user ID and new password details
   * @param {Response} res - Express response object for sending password change result
   * @returns {Promise<Response>} HTTP response indicating successful password update or error status
   * @throws {Error} Throws error if password change fails, with appropriate HTTP status code
   */
  changePassword = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.authService.changePassword(
        (req as any).user.userId,
        req.body as ChangePasswordDto
      );

      if (!result) {
        throw new HttpException();
      }

      return res.status(200).json({
        success: true,
        message: i18next.t("success.updated", { resource: "Password" }),
      });
    } catch (error) {
      console.error("Change password error:", error);

      if (error.status) {
        return res.status(error.status).json({
          success: false,
          message: i18next.t(error.message),
        });
      }

      return res.status(500).json({
        success: false,
        message: i18next.t("errors.server.internal"),
      });
    }
  };
}
