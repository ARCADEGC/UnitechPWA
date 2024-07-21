import { boolean, json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const order = pgTable("order", {
    id: uuid("id").unique().notNull().defaultRandom().primaryKey(),
    name: text("name").notNull(),
    content: json("content"),
    secretMessage: text("secret_message").notNull(),
    assignee: uuid("assignee")
        .notNull()
        .references(() => User.id, {
            onDelete: "cascade",
            onUpdate: "restrict",
        }),
    signature: json("signature"),
});

export const User = pgTable("user", {
    id: uuid("id").unique().notNull().primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    salt: text("salt").unique().notNull(),
    role: boolean("role").default(false),
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
