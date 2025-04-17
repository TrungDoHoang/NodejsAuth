import sequelize from "@/config/database";
import { UserRoleAttributes } from "@/types";
import { DataTypes, Model } from "sequelize";
import Role from "./Role";
import User from "./User";

class UserRole
  extends Model<UserRoleAttributes, UserRoleAttributes>
  implements UserRoleAttributes
{
  public userId!: string;
  public roleId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserRole.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: User,
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: Role,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "UserRole",
    tableName: "user_role",
    // Add unique constraint to ensure each user-role pair is unique
    indexes: [
      {
        unique: true,
        fields: ["userId", "roleId"],
      },
    ],
  }
);

// Set up associations
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  onDelete: "CASCADE",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleId",
  onDelete: "CASCADE",
});

export default UserRole;
