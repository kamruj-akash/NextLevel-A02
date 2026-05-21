import { Router } from "express";
import auth from "../middleware/auth.middleware";
import { createIssue, getAllIssue } from "./issues.controller";

const router = Router();

router.post("/", auth("contributor", "maintainer"), createIssue);
router.get("/", getAllIssue);

export const issuesRoute = router;
