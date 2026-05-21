import type { Request, Response } from "express";
import JwtService from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";
import authService from "./auth.service";

const signUpUser = async (req: Request, res: Response) => {
  const result = await authService.saveUserIntoDb(req.body);
  return sendResponse(
    res,
    {
      message: "User registered successfully",
      data: result as Record<string, any>,
    },
    200,
  );
};

const signInUser = async (req: Request, res: Response) => {
  const result = await authService.loginUserFromDb(req.body);
  const token = await JwtService.signToken(result.id);

  // send response with token
  return sendResponse(
    res,
    { message: "Login successful", data: { token, result } },
    200,
  );
};

export { signInUser, signUpUser };
