import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { config } from "../config";
import { sql } from "../db";
import AppError from "./AppError";

class JwtService {
  // sign token
  async signToken(id: number): Promise<string> {
    const secret = config.JWT_SECRET;
    if (!secret) throw new AppError("JWT secret not found", 500);

    const userInfo = await sql`
          SELECT *
          FROM users 
          WHERE id = ${id};
      `;

    if (!userInfo[0]) {
      throw new AppError("User not found", 404);
    }

    const token = jwt.sign(
      {
        id: userInfo[0].id,
        name: userInfo[0].name,
        role: userInfo[0].role,
      },
      secret,
      {
        expiresIn: config.JWT_EXPIRE,
      } as SignOptions,
    );
    return token;
  }

  // verify token
  async verifyToken(token: string): Promise<JwtPayload> {
    const secret = config.JWT_SECRET;
    if (!secret) throw new AppError("JWT secret not found", 500);

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      const userInfo = await sql`
                                SELECT *
                                FROM users 
                                WHERE id = ${decoded.id};
                              `;
      if (!userInfo[0]) {
        throw new AppError("User not found", 404);
      }

      return decoded;
    } catch (error) {
      throw new AppError("Invalid token", 401);
    }
  }
}

export default new JwtService();
