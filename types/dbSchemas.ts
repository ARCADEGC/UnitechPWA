import { order, User, OrderHeader, OrderNewPCK, OrderPP2, OrderListOne } from "@/db/schema";

export type TUser = typeof User.$inferInsert;

export type TPaid = "cash" | "card" | "unpaid";

export type TOrder = typeof order.$inferInsert;

export type TOrderHeader = typeof OrderHeader.$inferInsert;

export type TOrderNewPCK = typeof OrderNewPCK.$inferInsert;

export type TOrderPP2 = typeof OrderPP2.$inferInsert;

export type TOrderListOne = typeof OrderListOne.$inferInsert;

export type TOrderPP2Specifications = {
    highLocker: string | null;
    lowerLocker: string | null;
    upperLocker: string | null;
    milledJoint: string | null;
    tailoredWorktop: string | null;
    worktop: string | null;
    wallPanel: string | null;
    atypical: string | null;
    unnecessary: string | null;
    kitchen: string | null;

    lights: string | null;
    ikea: string | null;
    ikeaGas: string | null;
    nonIkea: string | null;
    nonIkeaGas: string | null;
};
