import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/db/schema";

export const db = drizzle(sql, { schema });

async function main() {
    await migrate(db, { migrationsFolder: "./db/drizzle" });
}

main();
