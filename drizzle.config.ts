import { defineConfig } from "drizzle-kit";
import { config } from "./src/config";
const { database, hostname, password,port, user } = config.DB_CONFIG;

export default defineConfig({
  schema: "./src/db/schemas/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    host: hostname,
    user,
    password,
    database,
  },
});
