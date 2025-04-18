import request from "supertest";
import { app } from "@/app";
import {
  setupTestEnv,
  teardownTestEnv,
  createTestUser,
} from "@/__tests__/helpers/test-utils";
import { generateTokens } from "@/utils/function";

describe("Auth API Integration Tests", () => {
  beforeAll(async () => {
    try {
      await setupTestEnv();
      console.log("Test environment setup complete");
    } catch (error) {
      console.error("Test environment setup failed:", error);
      throw error;
    }
  });

  // Clean up after all tests
  afterAll(async () => {
    await teardownTestEnv();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      try {
        const response = await request(app).post("/api/auth/register").send({
          username: "newuser",
          email: "newuser@example.com",
          password: "Password123!",
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data).toHaveProperty("accessToken");
        expect(response.body.data).toHaveProperty("refreshToken");
      } catch (error) {
        console.error("Registration test failed:", error);
        throw error;
      }
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "u", // Too short
        email: "invalid-email",
        password: "123", // Too short
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
    });

    it("should return 409 for existing username", async () => {
      // First create a user
      await createTestUser({
        username: "existinguser",
        email: "existing@example.com",
      });

      // Try to register with the same username
      const response = await request(app).post("/api/auth/register").send({
        username: "existinguser",
        email: "another@example.com",
        password: "Password123!",
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await createTestUser();
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/auth/profile", () => {
    it("should return user profile for authenticated user", async () => {
      // Create a user and generate a token
      const user = await createTestUser();
      const { accessToken } = generateTokens(user.id, ["user"]);

      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data).toHaveProperty("id", user.id);
      expect(response.body.data).toHaveProperty("username", "testuser");
    });

    it("should return 401 for unauthenticated request", async () => {
      const response = await request(app).get("/api/auth/profile");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  // Add more tests for other endpoints: logout, refresh-token, change-password
});
