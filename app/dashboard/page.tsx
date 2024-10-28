import Link from "next/link";

import { validateSession } from "@/auth";

import {
    getUserById,
    getUserNameById,
    getOrdersByIdAndRole,
    getNameFromHeaderByOrderId,
    getOrderNumberFromHeaderByOrderId,
    getOrderAssigneeByOrderId
} from "@/db/db";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { NoOrderFound } from "@/app/dashboard/NoOrderFound";

import { TOrder } from "@/types/dbSchemas";

import { OrderList } from "./OrderList";

export default async function Home() {
    const { user } = await validateSession();

    if (!user) return null;

    const currentUser = await getUserById(user.id);
    const userRole = currentUser?.role ?? false;

    const orders: TOrder[] = await getOrdersByIdAndRole(user.id, userRole);

    const preparedOrdres = await Promise.all(
        orders.map(async (order) => ({
            id: order.id,
            name: await getNameFromHeaderByOrderId(order.orderHeader),
            orderNumber: await getOrderNumberFromHeaderByOrderId(order.orderHeader),
            assignee: await getOrderAssigneeByOrderId(order.orderHeader).then((userUUID) =>
                userUUID ? getUserNameById(userUUID) : ""
            ),
            archived: order.archived ?? false
        }))
    );

    return (
        <main className="grid gap-4 [grid-column:content]">
            {orders.length !== 0 ?
                <OrderList
                    orders={preparedOrdres}
                    role={userRole}
                    userId={userRole ? user.id : ""}
                />
            :   <NoOrderFound
                    userId={user.id}
                    userRole={userRole}
                />
            }
        </main>
    );
}
