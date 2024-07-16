import Link from "next/link";

import { validateSession } from "@/auth";
import { getUserById, getUserNameById, getOrdersByIdAndRole } from "@/db/db";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { PromiseType } from "@/types/helpers";

export default async function Home() {
    const { user } = await validateSession();

    let userRole: boolean = false;
    let orders: PromiseType<typeof getOrdersByIdAndRole> = [];

    if (user) {
        const currentUser = await getUserById(user.id);

        userRole = currentUser?.role ?? false;

        orders = await getOrdersByIdAndRole(user.id, userRole);
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
                                {"secretMessage" in order && userRole && (
                                    <CardDescription>
                                        {order.secretMessage as string}
                                    </CardDescription>
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
