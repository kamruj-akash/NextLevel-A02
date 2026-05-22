import express, { type Application } from "express";
import { authRoute } from "./auth/auth.routes";
import { issuesRoute } from "./issues/issues.routes";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { logger } from "./middleware/logger";
import { sendResponse } from "./utils/sendResponse";

const app: Application = express();

// middleware
app.use(express.json());
app.use(logger());

// routes
app.get("/", (req, res) => {
  sendResponse(res, { message: "Welcome to Bug Tracker API!" }, 200);
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);

// not found
app.all(/.*/, (req, res) => {
  sendResponse(
    res,
    {
      message: `Route "${req.url}" with method "${req.method}" not found`,
    },
    404,
  );
});

// global error handler
app.use(globalErrorHandler);

export default app;
