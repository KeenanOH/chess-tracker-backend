import { configDotenv } from "dotenv"

configDotenv()

export const jwtSecret = process.env["JWT_SECRET"]
export const databaseUrl = process.env["DATABASE_URL"]
