import { db } from "./db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    const result = await db.execute(sql`select 1 as ok`);
    console.log("DB connection: OK");
    console.log(result);
    process.exit(0);
  } catch (err) {
    console.error("DB connection: FAILED");
    console.error(err);
    process.exit(1);
  }
}

main();
