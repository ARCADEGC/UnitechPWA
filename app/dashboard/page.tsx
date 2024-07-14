import Link from "next/link";

import { validateSession } from "@/auth";
import { getAdminOrders, getUserById, getUserNameById, getUserOrders } from "@/db/db";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default async function Home() {
    const { user } = await validateSession();

    let orders,
        userRole: "ADMIN" | "USER" | null | undefined = null;

    if (user) {
        const currentUser = await getUserById(user.id);

        userRole = currentUser?.role;

        if (userRole === "ADMIN") {
            orders = await getAdminOrders();
        }

        if (userRole === "USER") {
            orders = await getUserOrders(user.id);
        }
    }

    return (
        <main className="[grid-column:content]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders?.map((order) => (
                    <Link
                        href={`/dashboard/${order.id}`}
                        key={order.id}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>{order.name}</CardTitle>
                                {userRole === "ADMIN" && (
                                    <CardDescription>{order.secretMessage}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-3">{JSON.stringify(order.content)}</p>
                            </CardContent>
                            <CardFooter>
                                <p>{getUserNameById(order.author)}</p>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </main>
    );
}
