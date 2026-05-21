import express, { type Application } from "express";
import { authRoute } from "./auth/auth.routes";
import { issuesRoute } from "./issues/issues.routes";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);

// global error handler
app.use(globalErrorHandler);

export default app;
