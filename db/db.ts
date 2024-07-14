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

export async function getAdminOrders() {
    return await db.query.order.findMany();
}

export async function getAdminOrderById(id: string) {
    return await db.query.order.findMany({
        where: (table) => eq(table.id, id),
    });
}

export async function getUserOrders(userId: string) {
    return await db.query.order.findMany({
        where: (table) => eq(table.author, userId),
        columns: {
            id: true,
            name: true,
            content: true,
            author: true,
        },
    });
}

export async function getUserOrderById(id: string) {
    return await db.query.order.findMany({
        where: (table) => eq(table.id, id),
        columns: {
            id: true,
            name: true,
            content: true,
            author: true,
        },
    });
}

export async function getUserNameById(userId: string) {
    const user = await db.query.User.findFirst({
        where: (table) => eq(table.id, userId),
    });

    return user?.name ?? null;
}
