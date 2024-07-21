"use server";

import "@/lib/loadEnv";
import { eq } from "drizzle-orm";
import { db } from "@/db/migrate";

import { order, User } from "@/db/schema";
import type { TOrder, TUser } from "@/types/dbSchemas";

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
                where: (table) => eq(table.assignee, id),
                columns: {
                    id: true,
                    name: true,
                    content: true,
                    assignee: true,
                },
            });
}

export async function getOrderByIdAndRole(id: string, role: boolean): Promise<TOrder | undefined> {
    const order = await db.query.order.findFirst({
        where: (table) => eq(table.id, id),
    });

    if (!order) return undefined;

    if (!role) order.secretMessage = "";

    return order;
}

// . ||-------------------------------------------------------------------------------||
// . ||                                Helper funtions                                ||
// . ||-------------------------------------------------------------------------------||

export async function getUserNameById(userId: string) {
    const user = await db.query.User.findFirst({
        where: (table) => eq(table.id, userId),
    });

    return user?.name ?? null;
}

export async function getIdByUserName(userName: string) {
    const user = await db.query.User.findFirst({
        where: (table) => eq(table.name, userName),
    });

    return user?.id ?? null;
}

// . ||--------------------------------------------------------------------------------||
// . ||                                  Order Changes                                 ||
// . ||--------------------------------------------------------------------------------||

export async function updateOrder(content: TOrder, role: boolean) {
    return role ?
            await db
                .update(order)
                .set(content)
                .where(eq(order.id, content.id ?? ""))
                .returning()
        :   await db
                .update(order)
                .set({
                    assignee: content.assignee,
                    name: content.name,
                    content: content.content,
                    signature: content.signature,
                })
                .where(eq(order.id, content.id ?? ""))
                .returning();
}

// . ||--------------------------------------------------------------------------------||
// . ||                                  Create Order                                  ||
// . ||--------------------------------------------------------------------------------||

export async function CreateOrder({
    id,
    name = "New Name",
}: {
    id: string;
    name?: string;
}): Promise<string | boolean> {
    try {
        const newOrder = await db
            .insert(order)
            .values({ name: name, assignee: id, secretMessage: "", content: {} })
            .returning({ id: order.id });
        const newOrderId = newOrder[0].id;

        !newOrderId && new Error();

        return newOrderId;
    } catch {
        return false;
    }
}

// . ||--------------------------------------------------------------------------------||
// . ||                                  Delete Order                                  ||
// . ||--------------------------------------------------------------------------------||

export async function deleteOrder(orderId: string): Promise<boolean> {
    try {
        await db.delete(order).where(eq(order.id, orderId)).execute();
        return true;
    } catch {
        return false;
    }
}
