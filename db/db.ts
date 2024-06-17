"use server";

import "@/lib/loadEnv";
import { eq } from "drizzle-orm";
import { db } from "@/db/migrate";

import { User } from "@/db/schema";
import type { TUser } from "@/types/dbSchemas";

export async function getUsers() {
    return await db.select().from(User);
}

export async function createUser(user: TUser) {
    return await db.insert(User).values(user).returning();
}

export async function getUserSaltByEmail(email: string) {
    return await db.select({ salt: User.salt }).from(User).where(eq(User.email, email));
}
