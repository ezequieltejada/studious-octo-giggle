import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { config } from "../config";

const { database, hostname, password, port, user } = config.DB_CONFIG;

export const connection = new Client({
  host: hostname,
  port: port || 5432,
  user: user,
  password: password,
  database,
});

await connection.connect();
export const db = drizzle(connection);

