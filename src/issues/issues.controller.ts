import type { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import issuesService from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
  const payload = { reporter_id: req.user.id, ...req.body };

  const result = await issuesService.createIssue(payload);
  return sendResponse(
    res,
    {
      message: "Issue created successfully",
      data: result,
    },
    200,
  );
};

const getAllIssue = async (req: Request, res: Response) => {
  const result = await issuesService.getAllIssue(req.query);
  return sendResponse(
    res,
    {
      data: result,
    },
    200,
  );
};

const getSingleIssue = async (req: Request, res: Response) => {
  const result = await issuesService.getSingleIssue(Number(req.params.id));
  return sendResponse(res, { data: result }, 200);
};

const updateIssue = async (req: Request, res: Response) => {
  const result = await issuesService.updateIssue(
    Number(req.params.id),
    req.body,
    req.user,
  );
  return sendResponse(res, { data: result }, 200);
};

const deleteIssue = async (req: Request, res: Response) => {
  console.log("checked");
  const result = await issuesService.deleteIssue(Number(req.params.id));
  if (!result) {
    return sendResponse(res, { message: "Issue not found", error: true }, 404);
  }
  return sendResponse(res, { message: "Issue deleted successfully" }, 200);
};

export { createIssue, deleteIssue, getAllIssue, getSingleIssue, updateIssue };
