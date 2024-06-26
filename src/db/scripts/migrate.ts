import { migrate } from "drizzle-orm/node-postgres/migrator";
import { connection, db } from "../db";

async function runMigration() {
  await migrate(db, {
    migrationsFolder: "./drizzle",
    migrationsSchema: "public",
    migrationsTable: "migrations",
  });

  await connection.end();
}

runMigration();
