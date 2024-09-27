"use server";

import "@/lib/loadEnv";
import { and, desc, eq, lte, sql } from "drizzle-orm";
import { db } from "@/db/migrate";

import {
    order,
    User,
    Prices,
    AdminPrices,
    OrderHeader,
    OrderNewPCK,
    OrderPP2,
    OrderListOne,
} from "@/db/schema";
import type { TOrder, TOrderHeader, TOrderNewPCK, TOrderPP2, TUser } from "@/types/dbSchemas";
import { randomUUID } from "crypto";
import { toast } from "sonner";

// . ||--------------------------------------------------------------------------------||
// . ||                                     Users                                      ||
// . ||--------------------------------------------------------------------------------||

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
    if (role) return await db.query.order.findMany();

    const OrderHeaders = await db.query.OrderHeader.findMany({
        where: (table) => eq(table.assignee, id),
    });

    const orders = await db.query.order.findMany();

    const filteredOrders = [
        ...orders.filter((order) => OrderHeaders.some((header) => header.id === order.orderHeader)),
    ];

    return filteredOrders;
}

export async function getOrderByIdAndRole(id: string, role: boolean): Promise<TOrder | undefined> {
    const fetchedOrder =
        role ?
            await db.query.order.findFirst({
                where: (table) => eq(table.id, id),
            })
        :   await db.query.order.findFirst({
                where: (table) => eq(table.id, id),
            });

    if (!fetchedOrder) return undefined;

    // if (!role) order.secretMessage = "";

    return fetchedOrder;
}

export async function getOrderHeaderByIdAndRoleOrUser(
    id: string,
    role: boolean,
    userId: string,
): Promise<TOrderHeader | undefined> {
    const orderHeader = await db.query.OrderHeader.findFirst({
        where: (table) => eq(table.id, id),
    });

    if (!orderHeader) return undefined;

    if (role) return orderHeader;

    if (orderHeader?.assignee !== userId) return undefined;

    return orderHeader;
}

export async function getOrderNewPCKByIdAndRoleOrUser(
    id: string,
    role: boolean,
    userId: string,
): Promise<TOrderNewPCK | undefined> {
    // TODO : Check if user has access to this order
    // const assignee = await db.query.OrderHeader.findFirst({
    //     columns: { assignee: true },
    //     where: (table) => eq(table.id, id),
    // });

    const orderNewPCK = await db.query.OrderNewPCK.findFirst({
        where: (table) => eq(table.id, id),
    });

    // if (!orderNewPCK) return undefined;

    // if (role) return orderNewPCK;

    // if (assignee?.assignee === userId) return orderNewPCK;

    // return undefined;

    return orderNewPCK;
}

export async function getOrderPP2ByIdAndRoleOrUser(
    id: string,
    role: boolean,
    userId: string,
): Promise<TOrderPP2 | undefined> {
    // TODO : Check if user has access to this order
    // const assignee = await db.query.OrderHeader.findFirst({
    //     columns: { assignee: true },
    //     where: (table) => eq(table.id, id),
    // });

    const OrderPP2 = await db.query.OrderPP2.findFirst({
        where: (table) => eq(table.id, id),
    });

    // if ((assignee?.assignee !== userId && !role) || !OrderPP2) return undefined;

    return OrderPP2;
}

export async function getOrderList1ByIdAndRoleOrUser(
    id: string,
    role: boolean,
    userId: string,
): Promise<TOrderNewPCK | string | undefined> {
    // TODO : Check if user has access to this order
    // const assignee = await db.query.OrderHeader.findFirst({
    //     columns: { assignee: true },
    //     where: (table) => eq(table.id, id),
    // });

    const OrderList1 = await db.query.OrderListOne.findFirst({
        where: (table) => eq(table.id, id),
    });

    // if ((assignee?.assignee !== userId && !role) || !OrderList1)
    //     return "You do not have access to this order";

    return OrderList1;
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

export async function getNameFromHeaderByOrderId(orderId: string) {
    const orderHeader = await db.query.OrderHeader.findFirst({
        columns: { customer: true },
        where: (table) => eq(table.id, orderId),
    });

    return orderHeader?.customer;
}

export async function getOrderNumberFromHeaderByOrderId(orderId: string) {
    const orderHeader = await db.query.OrderHeader.findFirst({
        columns: { orderNumber: true, ikeaNumber: true },
        where: (table) => eq(table.id, orderId),
    });

    return `${orderHeader?.orderNumber} / ${orderHeader?.ikeaNumber}`;
}

export async function getOrderAssigneeByOrderId(orderId: string) {
    const orderHeader = await db.query.OrderHeader.findFirst({
        columns: { assignee: true },
        where: (table) => eq(table.id, orderId),
    });

    return orderHeader?.assignee;
}

// . ||--------------------------------------------------------------------------------||
// . ||                                  Order Changes                                 ||
// . ||--------------------------------------------------------------------------------||

export async function updateOrderHeader(
    orderHeaderId: string,
    content: TOrderHeader,
    role: boolean,
): Promise<void> {
    // TODO user validation
    await db
        .update(OrderHeader)
        .set(
            role ? content : (
                {
                    customer: content.customer,
                    address: content.address,
                    phone: content.phone,
                    email: content.email,
                    dueDate: content.dueDate,
                    orderNumber: content.orderNumber,
                    ikeaNumber: content.ikeaNumber,
                }
            ),
        )
        .where(eq(OrderHeader.id, orderHeaderId))
        .execute();
}

export async function updateOrderNewPCK(
    orderNewPCKId: string,
    content: TOrderNewPCK,
    role: boolean,
): Promise<void> {
    // TODO user validation
    await db
        .update(OrderNewPCK)
        .set(role ? content : content)
        .where(eq(OrderNewPCK.id, orderNewPCKId))
        .execute();
}

export async function updateOrderPP2(
    orderPP2Id: string,
    content: TOrderNewPCK,
    role: boolean,
): Promise<void> {
    // TODO user validation
    await db
        .update(OrderPP2)
        .set(role ? content : content)
        .where(eq(OrderPP2.id, orderPP2Id))
        .execute();
}

// export async function updateOrder(content: TOrder, role: boolean) {
//     return await db
//         .update(order)
//         .set(
//             role ? content : (
//                 {
//                     name: content.name,
//                     signature: content.signature,
//                     address: content.address,
//                     phone: content.phone,
//                     email: content.email,
//                     dueDate: content.dueDate,
//                     orderNumber: content.orderNumber,
//                     ikeaNumber: content.ikeaNumber,
//                     tax: content.tax,
//                     bail: content.bail,

//                     anotherService: content.anotherService,
//                     timeToFinish: content.timeToFinish,
//                     contactWithIkea: content.contactWithIkea,
//                     numOfReturn: content.numOfReturn,
//                     canceled: content.canceled,
//                     reasonOfCancelation: content.reasonOfCancelation,
//                     reasonOfImposibility: content.reasonOfImposibility,
//                     waterConnection: content.waterConnection,
//                     couplingsAndKitchenAdjustment: content.couplingsAndKitchenAdjustment,
//                     testDishwasherFaucet: content.testDishwasherFaucet,
//                     viewCutsOk: content.viewCutsOk,
//                     electricalAppliancesPluggedIn: content.electricalAppliancesPluggedIn,
//                     cleaningOfKitchenInstallationArea: content.cleaningOfKitchenInstallationArea,
//                     electricalTestAppliances: content.electricalTestAppliances,
//                     previousDamageToApartment: content.previousDamageToApartment,
//                     sealingOfWorktops: content.sealingOfWorktops,
//                     damageToFlatDuringInstallation: content.damageToFlatDuringInstallation,
//                     comment: content.comment,

//                     applianceOutsideOfIkea: content.applianceOutsideOfIkea,
//                     gasApplianceOutsideOfIkea: content.gasApplianceOutsideOfIkea,
//                     shipmentZoneOne: content.shipmentZoneOne,
//                     shipmentZoneTwo: content.shipmentZoneTwo,
//                     shipmentZoneThree: content.shipmentZoneThree,
//                     shipmentZoneFour: content.shipmentZoneFour,
//                     completeInstallationLockers: content.completeInstallationLockers,
//                     completeAtypical: content.completeAtypical,
//                     basicLockers: content.basicLockers,
//                     basicMilled: content.basicMilled,
//                     basicAtypical: content.basicAtypical,
//                     installationDigester: content.installationDigester,
//                     installationHob: content.installationHob,
//                     installationGasHob: content.installationGasHob,
//                     installationLights: content.installationLights,
//                     installationMicrowave: content.installationMicrowave,
//                     installationFreezer: content.installationFreezer,
//                     installationDishwasher: content.installationDishwasher,
//                     installationOven: content.installationOven,
//                     installationSink: content.installationSink,
//                     installationMilledJoint: content.installationMilledJoint,
//                     installationWorktop: content.installationWorktop,
//                     installationWallPanel: content.installationWallPanel,
//                 }
//             ),
//         )
//         .where(eq(order.id, content.id ?? ""))
//         .returning();
// }

// . ||--------------------------------------------------------------------------------||
// . ||                                  Create Order                                  ||
// . ||--------------------------------------------------------------------------------||

export async function CreateOrder(userId: string): Promise<string | boolean> {
    try {
        const newOrderHeaderId = await CreateOrderHeader(userId);
        const newOrderNewPCKId = await CreateOrderNewPCK();
        const newOrderNewPP2Id = await CreateOrderNewPP2();
        const newOrderNewList1Id = await CreateOrderNewList1();

        if (!newOrderHeaderId || !newOrderNewPCKId || !newOrderNewPP2Id || !newOrderNewList1Id)
            new Error("Nepodařilo se vytvořit všechny požadované prvky");

        const newOrder = await db
            .insert(order)
            .values({
                orderHeader: newOrderHeaderId.toString(),
                orderNewPCK: newOrderNewPCKId.toString(),
                orderPP2: newOrderNewPP2Id.toString(),
                orderListOne: newOrderNewList1Id.toString(),
                referenceDate: new Date(),
            })
            .returning({ id: order.id });

        const newOrderId = newOrder[0].id;

        if (
            !newOrderId &&
            newOrderHeaderId !== false &&
            newOrderNewPCKId !== false &&
            newOrderNewPP2Id !== false &&
            newOrderNewList1Id !== false
        ) {
            await db.delete(OrderHeader).where(eq(OrderHeader.id, newOrderHeaderId)).execute();
            await db.delete(OrderNewPCK).where(eq(OrderNewPCK.id, newOrderNewPCKId)).execute();
            await db.delete(OrderPP2).where(eq(OrderPP2.id, newOrderNewPP2Id)).execute();
            await db.delete(OrderListOne).where(eq(OrderListOne.id, newOrderNewList1Id)).execute();
        }

        return newOrderId;
    } catch (e) {
        toast.error(`${e}`);
        return false;
    }
}

async function CreateOrderHeader(userId: string) {
    try {
        const newOrderHeader = await db
            .insert(OrderHeader)
            .values({
                customer: "test",
                address: "test",
                phone: "123123123",
                email: "test",
                assignee: userId,
                dueDate: new Date(),
                orderNumber: 1,
                ikeaNumber: 1,
            })
            .returning({ id: OrderHeader.id });

        const newOrderHeaderId = newOrderHeader[0].id;

        !newOrderHeaderId && new Error("Nepodařilo se vytvořit hlavičku objednávky");

        return newOrderHeaderId;
    } catch {
        return false;
    }
}

async function CreateOrderNewPCK() {
    try {
        const newOrderHeader = await db
            .insert(OrderNewPCK)
            .values({})
            .returning({ id: OrderHeader.id });

        const newOrderHeaderId = newOrderHeader[0].id;

        !newOrderHeaderId && new Error("Nepodařilo se vytvořit nový PCK");

        return newOrderHeaderId;
    } catch {
        return false;
    }
}

async function CreateOrderNewPP2() {
    try {
        const newOrderHeader = await db
            .insert(OrderPP2)
            .values({
                date: new Date(),
            })
            .returning({ id: OrderHeader.id });

        const newOrderHeaderId = newOrderHeader[0].id;

        !newOrderHeaderId && new Error("Nepodařilo se vytvořit PP2");

        return newOrderHeaderId;
    } catch {
        return false;
    }
}

async function CreateOrderNewList1() {
    try {
        const newList1 = await db.insert(OrderListOne).values({}).returning({ id: OrderHeader.id });

        const newOderListOneId = newList1[0].id;

        !newOderListOneId && new Error("Nepodařilo se vytvořit nový List1");

        return newOderListOneId;
    } catch {
        return false;
    }
}

// . ||--------------------------------------------------------------------------------||
// . ||                                  Delete Order                                  ||
// . ||--------------------------------------------------------------------------------||

export async function deleteOrder(currentOrder: TOrder) {
    await db
        .delete(order)
        .where(eq(order.id, currentOrder?.id ?? ""))
        .returning();
    await db.delete(OrderHeader).where(eq(OrderHeader.id, currentOrder.orderHeader)).returning();
    await db.delete(OrderNewPCK).where(eq(OrderNewPCK.id, currentOrder.orderNewPCK)).returning();
    await db.delete(OrderPP2).where(eq(OrderPP2.id, currentOrder.orderPP2)).returning();
    await db.delete(OrderListOne).where(eq(OrderListOne.id, currentOrder.orderListOne)).returning();
}

// . ||--------------------------------------------------------------------------------||
// . ||                                     Prices                                     ||
// . ||--------------------------------------------------------------------------------||

export async function seedPrices(prices: { name: string; price: number }[]) {
    await db
        .insert(Prices)
        .values(
            prices.map((item) => ({
                name: item.name,
                price: String(item.price),
                validFrom: new Date(),
            })),
        )
        .execute();
}

export async function getPriceAtDate(productName: string, date: Date) {
    const price = await db.query.Prices.findFirst({
        orderBy: (table) => desc(table.validFrom),
        where: (table) => and(eq(table.name, productName), lte(table.validFrom, date)),
        columns: {
            price: true,
        },
    });

    return price;
}

export async function updateOrderPricesById(orderId: string) {
    await db
        .update(order)
        .set({ referenceDate: new Date() })
        .where(eq(order.id, orderId))
        .execute();
}

export async function seedAdminPrices(prices: { name: string; price: number }[]) {
    await db
        .insert(AdminPrices)
        .values(
            prices.map((item) => ({
                name: item.name,
                price: String(item.price),
                validFrom: new Date(),
            })),
        )
        .execute();
}

export async function getAdminPriceAtDate(productName: string, date: Date) {
    const price = await db.query.AdminPrices.findFirst({
        orderBy: (table) => desc(table.validFrom),
        where: (table) => and(eq(table.name, productName), lte(table.validFrom, date)),
        columns: {
            price: true,
        },
    });

    return price;
}
