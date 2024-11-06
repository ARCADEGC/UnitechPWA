import "@/lib/loadEnv";
import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    out: "./migrations",
    strict: true,
    verbose: true,
    dbCredentials: {
        url: process.env.POSTGRES_URL!
    }
}) satisfies Config;
