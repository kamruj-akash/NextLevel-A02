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
  const result = await issuesService.getAllIssue(req.query);
  sendResponse(
    res,
    {
      data: result,
    },
    200,
  );
};

const getSingleIssue = async (req: Request, res: Response) => {
  const result = await issuesService.getSingleIssue(Number(req.params.id));
  sendResponse(res, { data: result }, 200);
};

const updateIssue = async (req: Request, res: Response) => {
  const result = await issuesService.updateIssue(
    Number(req.params.id),
    req.body,
    req.user,
  );
  sendResponse(res, { data: result }, 200);
};

export { createIssue, getAllIssue, getSingleIssue, updateIssue };
