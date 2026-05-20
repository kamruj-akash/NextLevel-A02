import dotenv from "dotenv";
import { env } from "process";

dotenv.config({ quiet: true });
export const config = {
  PORT: env.PORT,
  DATABASE_URL: env.DATABASE_URL as string,
};
