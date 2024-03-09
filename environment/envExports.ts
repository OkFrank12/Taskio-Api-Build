import { config } from "dotenv";
config();

export const envExports = {
  PORT: process.env.PORT!,
  MONGODB_URI: process.env.MONGODB_URI!,
  TOKEN_SECRET: process.env.TOKEN_SECRET!,
  EMAIL_PASS: process.env.EMAIL_PASS!,
  EMAIL: process.env.EMAIL!,
};
