import { AuthController } from "@/controllers/auh.controller";
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "@/dtos/auth.dto";
import { authenticate } from "@/middlewares/auth.middleware";
import { validateRequest } from "@/middlewares/validateAuth.middleware";
import express, { Router } from "express";
import { z } from "zod";

const router = Router();
const authController = new AuthController();

// Public routes
router.post(
  "/register",
  validateRequest(registerSchema) as any,
  authController.register as any
);
router.post(
  "/login",
  validateRequest(loginSchema) as any,
  authController.login as any
);
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema) as any,
  authController.refreshToken as any
);

// Protected routes
const authenticatedRouter = express.Router();
authenticatedRouter.use(authenticate as any);
authenticatedRouter.get("/profile", authController.getProfile as any);
authenticatedRouter.post("/logout", authController.logout as any);
authenticatedRouter.patch(
  "/change-password",
  validateRequest(changePasswordSchema as unknown as z.AnyZodObject) as any,
  authController.changePassword as any
);
router.use("/me", authenticatedRouter);

export default router;
