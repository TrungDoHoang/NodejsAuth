import i18next from "@/config/i18n";
import routes from "@/routes";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import middleware from "i18next-http-middleware";
import morgan from "morgan";

// Load environment variables
dotenv.config();

// Initialize Express app
export const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.handle(i18next));
app.use((req: Request, _res: Response, next: NextFunction) => {
  i18next.changeLanguage(req.language);
  next();
});

// API Routes
app.use("/api", routes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Initialize database and start server
const initializeApp = async () => {
  try {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  }
};

initializeApp();
