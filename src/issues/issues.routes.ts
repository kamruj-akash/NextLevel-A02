import { Router } from "express";
import auth from "../middleware/auth.middleware";
import {
  createIssue,
  getAllIssue,
  getSingleIssue,
  updateIssue,
  deleteIssue
} from "./issues.controller";

const router = Router();

router.post("/", auth("contributor", "maintainer"), createIssue);
router.get("/", getAllIssue);
router.get("/:id", getSingleIssue);
router.patch("/:id", auth("contributor", "maintainer"), updateIssue);
router.delete("/:id", auth("maintainer"), deleteIssue);

export const issuesRoute = router;
