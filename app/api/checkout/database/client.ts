import knex from "knex";
import { dbConfig } from "./config";

export const db = knex({
  client: "pg",
  connection: dbConfig.url,
  acquireConnectionTimeout: 10 * 10000,
  pool: { min: 2, max: 10 },
});
