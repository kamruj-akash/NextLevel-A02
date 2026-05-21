import dotenv from "dotenv";
import { env } from "process";

dotenv.config({ quiet: true });
export const config = {
  PORT: env.PORT,
  DATABASE_URL: env.DATABASE_URL as string,
  NODE_ENV: env.NODE_ENV as string,
  JWT_SECRET: env.JWT_SECRET as string,
  JWT_EXPIRE: env.JWT_EXPIRE as string,
};
