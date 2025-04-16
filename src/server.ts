import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "@/routes";
import sequelize from "@/config/database";
import { Role } from "@/models";
import middleware from "i18next-http-middleware";
import i18next from "@/config/i18n";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
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

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Auth API",
    version: "1.0.0",
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
    // Create default roles if they don't exist
    const defaultRoles = ["admin", "user"];
    defaultRoles.forEach(async (roleName) => {
      const [_role, created] = await Role.findOrCreate({
        where: { name: roleName },
        defaults: {
          name: roleName,
          description: `${
            roleName.charAt(0).toUpperCase() + roleName.slice(1)
          } role`,
        },
      });

      if (created) {
        console.log(`Created default role: ${roleName}`);
      }
    });
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
