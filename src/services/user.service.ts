import { HttpException } from "@/exceptions/http.exception";
import { Role, User } from "@/models";
import { UserRepository } from "@/repositories/user.repository";
import { UserCreationAttributes } from "@/types";
import { IUser, IUserService } from "@/types/services/user.service.interface";
import { t } from "i18next";
import { Op } from "sequelize";

export class UserService implements IUserService {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  async listUsers(perPage: number, page: number): Promise<User[]> {
    const users = await this.userRepository.findAll({
      attributes: { exclude: ["password", "refreshToken"] },
      where: { isActive: true, deletedAt: null },
      limit: perPage,
      offset: (page - 1) * perPage,
      include: {
        model: Role,
        as: "roles",
        attributes: ["id", "name"], // Include only the role ID and name
        through: { attributes: [] }, // Exclude the roles from the result
      },
    });
    return users;
  }

  async usersDeleted(perPage: number, page: number): Promise<User[]> {
    const users = await this.userRepository.findAll({
      attributes: { exclude: ["password", "refreshToken"] },
      where: { deletedAt: { [Op.not]: null } },
      limit: perPage,
      offset: (page - 1) * perPage,
      include: {
        model: Role,
        as: "roles",
        attributes: ["id", "name"], // Include only the role ID and name
        through: { attributes: [] }, // Exclude the roles from the result
      },
    });
    return users;
  }

  async getUser(id: string): Promise<IUser | null> {
    const user = await this.userRepository.findById(id, {
      attributes: { exclude: ["password", "refreshToken"] },
      include: {
        model: Role,
        attributes: ["id", "name"], // Include only the role ID and name
        through: { attributes: [] }, // Exclude the roles from the result
      },
    });
    if (!user) {
      throw new HttpException(404, t("errors.user.userNotFoundOrInactive"));
    }
    const roles = (user as any).roles.map((role) => role);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles,
    };
  }

  async updateUser(
    id: string,
    data: UserCreationAttributes
  ): Promise<IUser | null> {
    const user = await this.userRepository.findById(id, {
      attributes: { exclude: ["password", "refreshToken"] },
      include: {
        model: Role,
        as: "roles",
        attributes: ["id", "name"], // Include only the role ID and name
        through: { attributes: [] }, // Exclude the roles from the result
      },
    });

    if (!user) {
      throw new HttpException(404, t("errors.user.userNotFoundOrInactive"));
    }

    // Update user data
    user.update(data, {
      fields: ["username", "email", "isActive"], // Only update these fields
    });
    await user.save();

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: (user as any).roles,
    };
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, t("errors.user.userNotFoundOrInactive"));
    }

    // Mark as deleted
    user.deletedAt = new Date();
    user.isActive = false;
    await user.save();

    return true;
  }

  async restoreUser(userId: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId, deletedAt: { [Op.not]: null } },
    });

    if (!user) {
      throw new HttpException(404, t("errors.user.userNotDeleted"));
    }

    // Mark as restored
    user.deletedAt = null;
    user.isActive = true;
    await user.save();

    return true;
  }
}
