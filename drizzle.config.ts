import { defineConfig } from "drizzle-kit";
import "@/lib/loadEnv";

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    out: "./db/drizzle",
    strict: true,
    verbose: true,
    dbCredentials: {
        url: process.env.POSTGRES_URL!,
    },
});
