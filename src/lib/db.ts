import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Brak DATABASE_URL — ustaw w .env.local");
}

const globalForPg = globalThis as typeof globalThis & {
  __flPgPool?: Pool;
};

export const pool =
  globalForPg.__flPgPool ??
  new Pool({
    connectionString,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.__flPgPool = pool;
}
