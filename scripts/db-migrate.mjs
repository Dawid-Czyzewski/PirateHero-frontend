import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import pg from "pg";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Brak DATABASE_URL (.env.local lub env).");
  process.exit(1);
}

const dir = resolve(process.cwd(), "db");
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("Brak plików db/*.sql");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
try {
  await client.connect();
  for (const file of files) {
    const sql = readFileSync(join(dir, file), "utf8");
    process.stdout.write(`→ ${file} ... `);
    await client.query(sql);
    console.log("OK");
  }
  console.log(`Migracja zakończona (${files.length} plik(ów)).`);
} catch (err) {
  console.error("Migracja FAIL:", err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
