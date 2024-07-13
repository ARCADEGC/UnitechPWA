import { json, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role_enum", ["ADMIN", "USER"]);

export const order = pgTable("order", {
    id: uuid("id").unique().notNull().defaultRandom().primaryKey(),
    name: text("name").notNull(),
    content: json("content"),
    secretMessage: text("secret_message").notNull(),
    author: uuid("author")
        .notNull()
        .references(() => User.id, {
            onDelete: "cascade",
            onUpdate: "restrict",
        }),
});

export const User = pgTable("user", {
    id: uuid("id").unique().notNull().primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    salt: text("salt").unique().notNull(),
    role: userRoleEnum("role").default("USER"),
});

export const Session = pgTable("session", {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => User.id, {
            onDelete: "cascade",
            onUpdate: "restrict",
        }),
    expiresAt: timestamp("expiresAt", {
        mode: "date",
        withTimezone: true,
    }).notNull(),
});
