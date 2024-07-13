import { User } from "@/db/schema";

export type TUser = typeof User.$inferInsert;

export type TUserRoleEnum = "ADMIN" | "USER";
