import sequelize from "@/config/database";
import { Role, User, UserRole } from "@/models";

export async function initializeData() {
  try {
    // Tạo transaction để đảm bảo tính nhất quán
    const t = await sequelize.transaction();

    try {
      // Create default roles if they don't exist

      const [adminRole] = await Role.findOrCreate({
        where: { name: "admin" },
        defaults: {
          name: "admin",
          description: "Administrator role",
        },
        transaction: t,
      });

      const [_userRole] = await Role.findOrCreate({
        where: { name: "user" },
        defaults: {
          name: "user",
          description: "Regular user role",
        },
        transaction: t,
      });

      // Tạo admin user
      const [admin] = await User.findOrCreate({
        where: { username: "dhtrung" },
        defaults: {
          username: "dhtrung",
          email: "dhtrung@gmail.com",
          password: "abc123", // Sẽ được hash bởi hook
        },
        transaction: t,
      });

      // Tạo user-role relationship
      await UserRole.findOrCreate({
        where: {
          userId: admin.id,
          roleId: adminRole.id,
        },
        defaults: {
          userId: admin.id,
          roleId: adminRole.id,
        },
        transaction: t,
      });

      // Commit transaction
      await t.commit();
      console.log("Default data initialized successfully");
    } catch (error) {
      // Rollback transaction nếu có lỗi
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error initializing default data:", error);
  } finally {
    // Đóng kết nối nếu cần
    await sequelize.close();
    console.log("Database connection closed");
  }
}
