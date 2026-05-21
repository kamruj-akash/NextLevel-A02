import bcrypt from "bcryptjs";
import { sql } from "../db";
import { roles, type Role, type RUser, type User } from "../types";
import AppError from "../utils/AppError";

class AuthService {
  private async hashPassword(pass: string) {
    const hashPass = await bcrypt.hash(pass, 10);
    return hashPass;
  }
  private async comparePassword(pass: string, hashPass: string) {
    const result = await bcrypt.compare(pass, hashPass);
    return result;
  }

  // create a new user
  async saveUserIntoDb(payload: User): Promise<RUser> {
    const hashPass = await this.hashPassword(payload.password);
    payload.password = hashPass;
    const { name, email, password, role } = payload;

    const userRole: Role = role ?? "contributor";
    if (!roles.includes(userRole)) {
      throw new Error("Invalid role");
    }

    const result = await sql`
        INSERT INTO users (name, email, password, role)
        VALUES (${name}, ${email}, ${password}, ${userRole})
        RETURNING id, name, email, role, created_at, updated_at
    `;
    return result[0] as RUser;
  }

  // login user
  async loginUserFromDb(payload: Omit<User, "name" | "role">): Promise<RUser> {
    const { email, password } = payload;

    const userInfo = await sql`
            SELECT *
            FROM users 
            WHERE email = ${email};
        `;
    if (!userInfo[0]) {
      throw new AppError("User not found", 404);
    }

    const isMatchPass = await this.comparePassword(
      password,
      userInfo[0].password,
    );

    delete userInfo[0].password;

    if (!isMatchPass) {
      throw new AppError("Invalid credentials", 401);
    }

    // return user info
    return userInfo[0] as RUser;
  }
}

export default new AuthService();
