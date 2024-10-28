import "@/lib/loadEnv";
import { defineConfig } from "drizzle-kit";

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
