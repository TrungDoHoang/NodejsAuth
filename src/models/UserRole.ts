import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";
import { UserRoleAttributes } from "../types";
import User from "./User";
import Role from "./Role";

interface UserRoleCreationAttributes
  extends Optional<UserRoleAttributes, "id"> {}

class UserRole
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  public id!: string;
  public userId!: string;
  public roleId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserRole.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.UUID,
      references: {
        model: Role,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "UserRole",
  }
);

// Set up associations
User.belongsToMany(Role, { through: UserRole, foreignKey: "userId" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });

export default UserRole;
