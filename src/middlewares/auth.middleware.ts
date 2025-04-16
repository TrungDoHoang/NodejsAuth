import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, Role } from "@/models";
import { AuthRequest, TokenPayload } from "@/types";
import { t } from "i18next";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: t("errors.auth.missingToken"),
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    // Find user
    const user = await User.findByPk(decoded.userId, {
      include: {
        model: Role,
        through: { attributes: [] },
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      roles: (user as any).Roles?.map((role) => role.name),
    };

    next();
  } catch (error: any) {
    console.error("Authentication error:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: t("errors.auth.invalidOrExpiredToken"),
      });
    }

    return res.status(500).json({
      success: false,
      message: t("errors.auth.authenticationError"),
      error: error.message,
    });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: t("errors.auth.userNotAuthenticated"),
      });
    }

    const userRoles = req.user.roles || [];
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: t("errors.auth.insufficientPermissions"),
      });
    }

    next();
  };
};
