import type { NextFunction, Request, Response } from "express";
import { config } from "../config";
import AppError from "../utils/AppError";

const globalErrorHandler = async (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err instanceof Error ? err.message : "Internal Server Error",
    stack:
      config.NODE_ENV === "development" && err instanceof Error
        ? err.stack
        : undefined,
  });
};

export default globalErrorHandler;
