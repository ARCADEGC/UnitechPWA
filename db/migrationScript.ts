import config from "@/drizzle.config";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";

import { db } from "./migrate";

async function main() {
    await migrate(db, { migrationsFolder: config.out! });

    // await sql.end();
}

main();
