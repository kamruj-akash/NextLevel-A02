import { Router } from "express";
import { signInUser, signUpUser } from "./auth.controller";

const router = Router();

router.post("/signup", signUpUser);
router.post("/login", signInUser);

export const authRoute = router;
