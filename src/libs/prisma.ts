import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const isDevelopment = process.env.NODE_ENV === "development";
const prisma = new PrismaClient({
  log: isDevelopment ? ["query", "info", "warn", "error"] : ["error"],
});

export default prisma;
