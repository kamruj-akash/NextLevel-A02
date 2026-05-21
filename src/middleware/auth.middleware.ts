import type { NextFunction, Request, Response } from "express";
import type { Role } from "../types";
import JwtService from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization as string;
      if (!token) {
        sendResponse(
          res,
          {
            message: "Unauthorized",
            error: true,
          },
          401,
        );
      }

      const verifyToken = await JwtService.verifyToken(token);
      if (!roles.includes(verifyToken.role)) {
        sendResponse(
          res,
          {
            message: "Unauthorized",
            error: true,
          },
          401,
        );
      }
      req.user = verifyToken;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
