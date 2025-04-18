import { HttpException } from "@/exceptions/http.exception";
import { RoleRepository } from "@/repositories/role.repository";
import { UserRepository } from "@/repositories/user.repository";
import { AuthService } from "@/services/auth.service";
import { generateTokens } from "@/utils/function";

// Mock dependencies
jest.mock("@/repositories/user.repository");
jest.mock("@/repositories/role.repository");
jest.mock("@/utils/function");

describe("AuthService", () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRoleRepository: jest.Mocked<RoleRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    mockRoleRepository = new RoleRepository() as jest.Mocked<RoleRepository>;

    // @ts-ignore - Accessing private properties for testing
    authService = new AuthService();
    // @ts-ignore - Replace repositories with mocks
    authService.userRepository = mockUserRepository;
    // @ts-ignore
    authService.roleRepository = mockRoleRepository;

    // Mock generateTokens
    (generateTokens as jest.Mock).mockReturnValue({
      accessToken: "test-access-token",
      refreshToken: "test-refresh-token",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      // Arrange
      const registerDto = {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
      };

      const mockUser = {
        ...registerDto,
        save: jest.fn().mockResolvedValue(true),
      };

      const mockRole = { name: "user" };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser as any);
      mockRoleRepository.findByName.mockResolvedValue(mockRole as any);
      mockUserRepository.addRole.mockResolvedValue(undefined);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalledWith(registerDto);
      expect(mockRoleRepository.findByName).toHaveBeenCalledWith("user");
      expect(mockUserRepository.addRole).toHaveBeenCalledWith(
        mockUser,
        mockRole
      );
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: undefined,
          username: "newuser",
          email: "newuser@example.com",
          roles: [
            {
              id: undefined,
              name: "user",
            },
          ],
        },
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
      });
    });

    it("should throw an error if user already exists", async () => {
      // Arrange
      const registerDto = {
        username: "existinguser",
        email: "existing@example.com",
        password: "password123",
      };

      mockUserRepository.findOne.mockResolvedValue({ id: 1 } as any);

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow(
        HttpException
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      // Arrange
      const loginDto = {
        username: "testuser",
        password: "password123",
      };

      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        isValidPassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
        Roles: [{ id: 2, name: "user" }],
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser as any);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockUser.isValidPassword).toHaveBeenCalledWith("password123");
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          roles: [{ id: 2, name: "user" }],
        },
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token",
      });
    });

    it("should throw an error if user is not found", async () => {
      // Arrange
      const loginDto = {
        username: "nonexistent",
        password: "password123",
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(HttpException);
    });

    it("should throw an error if password is invalid", async () => {
      // Arrange
      const loginDto = {
        username: "testuser",
        password: "wrongpassword",
      };

      const mockUser = {
        id: 1,
        username: "testuser",
        isValidPassword: jest.fn().mockResolvedValue(false),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser as any);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(HttpException);
      expect(mockUser.isValidPassword).toHaveBeenCalledWith("wrongpassword");
    });
  });

  // Add more tests for other methods: getProfile, logout, refreshToken, changePassword
});
