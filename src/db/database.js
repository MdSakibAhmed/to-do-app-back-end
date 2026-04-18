import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import dotenv from "dotenv";
const __dirname = dirname(fileURLToPath(import.meta.url));

// Store db.json in /data so Docker can mount a volume there
const DB_PATH = process.env.DB_PATH || join(__dirname, "../../data/db.json");
console.log(process.env.DB_PATH, "db path");
const defaultData = { todos: [] };

const adapter = new JSONFile(DB_PATH);
export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  // If file was empty, write the defaults
  db.data ||= defaultData;
  await db.write();
  console.log(`📦 Database ready at ${DB_PATH}`);
}
