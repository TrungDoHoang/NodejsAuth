import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

// API routes
router.use(authRoutes);

export default router;
