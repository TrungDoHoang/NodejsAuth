import { Role } from "@/models";
import { BaseRepository } from "./base.repository";
import { Op } from "sequelize";

export class RoleRepository extends BaseRepository<typeof Role.prototype> {
  constructor() {
    super(Role);
  }

  async findByName(name: string): Promise<typeof Role.prototype | null> {
    return this.model.findOne({ where: { name } });
  }
}
