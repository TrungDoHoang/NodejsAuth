import i18next from "@/config/i18n";
import { LoginDto, RegisterDto } from "@/dtos/auth.dto";
import { Role, User } from "@/models";
import { AuthService } from "@/services/auth.service";
import { TokenPayload } from "@/types";
import { generateTokens } from "@/utils/function";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

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

  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;
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

  logout = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { refreshToken } = req.body;

      const result = await this.authService.logout(refreshToken);

      if (!result) {
        throw new Error();
      }

      return res.status(200).json({
        success: true,
        message: i18next.t("auth.success.logoutSuccess"),
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
}
