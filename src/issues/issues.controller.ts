import type { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import issuesService from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  const payload = { reporter_id: req.user.id, ...req.body };
  try {
    const result = await issuesService.createIssue(payload);
    sendResponse(
      res,
      {
        message: "Issue created successfully",
        data: result,
      },
      200,
    );
  } catch (error) {
    sendResponse(
      res,
      {
        message: "Issue creation failed",
        error: true,
      },
      500,
    );
  }
};

const getAllIssue = async (req: Request, res: Response) => {
  const result = await issuesService.getAllIssue();
};

export { createIssue, getAllIssue };
