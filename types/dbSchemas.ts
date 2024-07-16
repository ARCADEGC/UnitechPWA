import { order, User } from "@/db/schema";

export type TUser = typeof User.$inferInsert;

export type TOrder = typeof order.$inferInsert;
