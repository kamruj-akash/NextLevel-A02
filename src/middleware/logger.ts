// logger middleware

import type { NextFunction, Request, Response } from "express";

export const logger = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(
      `request to "${req.url}" with method "${req.method}" at [${new Date().toLocaleString()}]`,
    );
    next();
  };
};
