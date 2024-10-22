import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db/migrate";
import { User, Session } from "@/db/schema";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const adapter = new DrizzlePostgreSQLAdapter(db, Session, User);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
});

export const validateSession = cache(async () => {
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId)
        return {
            user: null,
            session: null,
        };

    const { user, session } = await lucia.validateSession(sessionId);

    try {
        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);

            (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
        if (!session) {
            const sessionCookie = lucia.createBlankSessionCookie();

            (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
    } catch {
        // Next.js throws error when attempting to set cookies when rendering page
        redirect("/login");
    }
    return { user, session };
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}
