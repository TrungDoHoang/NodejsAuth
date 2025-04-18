import { Sequelize } from "sequelize";
import { User, Role } from "@/models";

// Create a SQLite in-memory database for testing
const testSequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: true, // Disable logging for tests
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    // Disable the modification of table names
    freezeTableName: true,
    // Don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
  },
});

// Function to override the database connection for all models
export const overrideSequelizeForTests = async () => {
  try {
    // Override the sequelize instance for all models
    const models = [User, Role];
    models.forEach((model) => {
      if (model.sequelize) {
        Object.defineProperty(model, "sequelize", {
          value: testSequelize,
          writable: true,
        });
      }
    });

    // Sync all models to create tables
    await testSequelize.sync({ force: true });
    console.log("Test database synced successfully");

    return testSequelize;
  } catch (error) {
    console.error("Failed to override database for tests:", error);
    throw error;
  }
};

// Function to close the test database connection
export const closeTestDatabase = async (sequelize: Sequelize) => {
  try {
    await sequelize.close();
    console.log("Test database connection closed");
  } catch (error) {
    console.error("Failed to close test database:", error);
  }
};
