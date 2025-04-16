import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./auth.routes";

const router = Router();

// API routes
router.use(userRoutes);
router.use(authRoutes);

export default router;
