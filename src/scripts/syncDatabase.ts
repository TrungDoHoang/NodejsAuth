import sequelize from "@/config/database";
import dotenv from "dotenv";
import { initializeData } from "./init-data";

dotenv.config();

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");
    await initializeData();
  } catch (error) {
    console.error("Failed to sync database:", error);
    process.exit(1);
  }
};

syncDatabase();
