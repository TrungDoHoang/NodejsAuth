import {
  overrideSequelizeForTests,
  closeTestDatabase,
} from "./database-helper";
import { User, Role } from "@/models";
import { syncDatabase } from "@/scripts/syncDatabase";
import bcrypt from "bcryptjs";

let testSequelize: any = null;

export const setupTestEnv = async () => {
  // Override database connection for tests
  testSequelize = await overrideSequelizeForTests();
  await syncDatabase();

  // Create test roles
  try {
    console.log("Test roles created successfully");
  } catch (error) {
    console.error("Failed to create test roles:", error);
    throw error;
  }
};

export const teardownTestEnv = async () => {
  if (testSequelize) {
    await closeTestDatabase(testSequelize);
  }
};

export const createTestUser = async (userData = {}) => {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create user
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      isActive: true,
      ...userData,
    });

    // Find user role
    const userRole = await Role.findOne({ where: { name: "user" } });

    // Assign role to user
    if (userRole) {
      await (user as any).addRole(userRole);
    }

    return user;
  } catch (error) {
    console.error("Failed to create test user:", error);
    throw error;
  }
};
