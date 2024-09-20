import { order, User, OrderHeader, OrderNewPCK, OrderPP2 } from "@/db/schema";

export type TUser = typeof User.$inferInsert;

export type TOrder = typeof order.$inferInsert;

export type TOrderHeader = typeof OrderHeader.$inferInsert;

export type TOrderNewPCK = typeof OrderNewPCK.$inferInsert;

export type TOrderPP2 = typeof OrderPP2.$inferInsert;
