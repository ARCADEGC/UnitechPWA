"use server";

import { hash, compare } from "bcryptjs";
import { lucia, validateSession } from "@/auth";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { createUser } from "@/db/db";

import { db } from "@/db/migrate";

import type { TRegisterProps, TLoginProps } from "@/types/authSchemas";

const ONE_MONTH = 60 * 60 * 24 * 30;

export const registerFunction = async (values: TRegisterProps) => {
    const hashedPassword = await hash(values.password, 10);
    const userId = randomUUID();

    try {
        await createUser({
            id: userId,
            name: values.username,
            email: values.email,
            password: hashedPassword,
            salt: values.salt,
        });

        const session = await lucia.createSession(userId, {
            expiresIn: ONE_MONTH,
        });
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return { success: true };
    } catch (error: any) {
        return {
            error: error?.message,
        };
    }
};

export const loginFunction = async (values: TLoginProps) => {
    const user = await db.query.User.findFirst({
        where: (table) => eq(table.email, values.email),
    });

    if (!user) return { error: "User not found" };

    if (!user.password) return { error: "User not found" };

    const passwordValidation = await compare(values.password, user.password);

    if (!passwordValidation) return { error: "Incorrect username or password" };

    const session = await lucia.createSession(user.id, {
        expiresIn: ONE_MONTH,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return { success: true };
};

export const logOut = async () => {
    const session = await validateSession();

    if (!session.session) return { error: "No session found" };

    await lucia.invalidateSession(session.session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return { success: true };
};
