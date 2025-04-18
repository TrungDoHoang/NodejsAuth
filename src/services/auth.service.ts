import { ChangePasswordDto, LoginDto, RegisterDto } from "@/dtos/auth.dto";
import { HttpException } from "@/exceptions/http.exception";
import { Role } from "@/models";
import { RoleRepository } from "@/repositories/role.repository";
import { UserRepository } from "@/repositories/user.repository";
import { RoleAttributes, TokenPayload } from "@/types";
import { IAuthService } from "@/types/services/auth.service.interface";
import { generateTokens } from "@/utils/function";
import { t } from "i18next";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export class AuthService implements IAuthService {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.roleRepository = new RoleRepository();
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new HttpException(409, t("errors.auth.userAlreadyExists"));
    }

    // Create new user
    const user = await this.userRepository.create({
      username,
      email,
      password,
    });

    // Find the default user role
    const userRole = await this.roleRepository.findByName("user");

    // Assign default role to user
    if (userRole) {
      await this.userRepository.addRole(user, userRole);
    }

    // Get user roles
    const roles = userRole ? [userRole] : [];

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      roles.map((role) => role.name)
    );

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { username, isActive: true },
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
      // rejectOnEmpty: true
    });

    // Check if user exists
    if (!user) {
      throw new HttpException(401, t("errors.auth.userNotFoundOrInactive"));
    }

    // Check if password is correct
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      throw new HttpException(401, t("errors.auth.invalidCredentials"));
    }

    // Get user roles
    const roles =
      (user as any).Roles?.map((role: RoleAttributes) => role) || [];

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, roles);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles,
      },
      accessToken,
      refreshToken,
    };
  }

  async getProfile(userId: number) {
    if (!userId) {
      throw new HttpException(401, t("errors.auth.notAuthenticated"));
    }

    const user = await this.userRepository.findById(userId, {
      attributes: { exclude: ["password", "refreshToken"] },
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      throw new HttpException(404, t("errors.auth.userNotFound"));
    }

    // Get user roles
    const roles =
      (user as any).Roles?.map((role: RoleAttributes) => role) || [];

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async logout(userId: number) {
    // Find user with this refresh token
    const user = await this.userRepository.findOne({
      where: { id: userId },
      // rejectOnEmpty: true
    });

    if (!user) {
      throw new HttpException(404, t("errors.auth.userNotFoundOrInactive"));
    }

    // Clear refresh token
    user.refreshToken = null;
    await user.save();
    return true;
  }

  async refreshToken(refreshToken: string) {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as TokenPayload;

    // Find user with this refresh token
    const user = await this.userRepository.findOne({
      where: {
        id: decoded.userId,
        refreshToken,
      },
      include: {
        model: Role,
        through: { attributes: [] },
      },
      // rejectOnEmpty: true
    });

    if (!user) {
      throw new HttpException(401, t("errors.auth.invalidOrExpiredToken"));
    }

    // Get user roles
    const roles = (user as any).Roles?.map((role: any) => role.name) || [];

    // Generate new tokens
    const newTokens = generateTokens(user.id, roles);

    // Update refresh token in database
    user.refreshToken = newTokens.refreshToken;
    await user.save();

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, t("errors.auth.userNotFoundOrInactive"));
    }

    const isPasswordValid = await user.isValidPassword(oldPassword);

    if (!isPasswordValid) {
      throw new HttpException(401, t("errors.auth.oldPasswordInvalid"));
    }

    user.password = newPassword;
    await user.save();

    return true;
  }
}
