import sequelize from "@/config/database";
import { Role } from "@/models";
import dotenv from "dotenv";

dotenv.config();

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized");

    // Create default roles if they don't exist
    const defaultRoles = ["admin", "user"];
    for (const roleName of defaultRoles) {
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
    }

    await sequelize.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Failed to sync database:", error);
    process.exit(1);
  }
};

syncDatabase();
