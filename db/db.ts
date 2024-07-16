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

export async function getUserById(id: string) {
    return await db.query.User.findFirst({
        where: (table) => eq(table.id, id),
        columns: {
            role: true,
        },
    });
}

// . ||--------------------------------------------------------------------------------||
// . ||                                   Get Orders                                   ||
// . ||--------------------------------------------------------------------------------||

export async function getOrdersByIdAndRole(id: string, role: boolean) {
    return role ?
            await db.query.order.findMany()
        :   await db.query.order.findMany({
                where: (table) => eq(table.author, id),
                columns: {
                    id: true,
                    name: true,
                    content: true,
                    author: true,
                },
            });
}

export async function getOrderByIdAndRole(id: string, role: boolean) {
    return role ?
            await db.query.order.findFirst({
                where: (table) => eq(table.id, id),
            })
        :   await db.query.order.findFirst({
                where: (table) => eq(table.id, id),
                columns: {
                    id: true,
                    name: true,
                    content: true,
                    author: true,
                },
            });
}

// . ||--------------------------------------------------------------------------------||
// . ||                                Helper funtions                                ||
// . ||--------------------------------------------------------------------------------||

export async function getUserNameById(userId: string) {
    const user = await db.query.User.findFirst({
        where: (table) => eq(table.id, userId),
    });

    return user?.name ?? null;
}
