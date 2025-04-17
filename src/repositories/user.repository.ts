import { User, Role } from "@/models";
import { BaseRepository } from "./base.repository";
import { Op } from "sequelize";

export class UserRepository extends BaseRepository<typeof User.prototype> {
  constructor() {
    super(User);
  }

  async findByUsername(
    username: string
  ): Promise<typeof User.prototype | null> {
    return this.model.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<typeof User.prototype | null> {
    return this.model.findOne({ where: { email } });
  }

  async findByUsernameOrEmail(
    identifier: string
  ): Promise<typeof User.prototype | null> {
    return this.model.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
  }

  async findByAccountActive(
    identifier: string
  ): Promise<typeof User.prototype | null> {
    return this.model.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
        isActive: true,
      },
    });
  }

  async findWithRoles(
    id: number | string
  ): Promise<typeof User.prototype | null> {
    return this.findById(id, {
      include: {
        model: Role,
        through: { attributes: [] },
      },
    });
  }

  async addRole(
    user: typeof User.prototype,
    role: typeof Role.prototype
  ): Promise<void> {
    await (user as any).addRole(role);
  }

  async removeRole(
    user: typeof User.prototype,
    role: typeof Role.prototype
  ): Promise<void> {
    await (user as any).removeRole(role);
  }

  async addRoles(
    user: typeof User.prototype,
    roles: (typeof Role.prototype)[]
  ): Promise<void> {
    await (user as any).addRoles(roles);
  }
}
