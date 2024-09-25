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

import { CreateNewButton } from "@/app/dashboard/CreateNewButton";
import { NoOrderFound } from "@/app/dashboard/NoOrderFound";

export default async function Home() {
    const { user } = await validateSession();

    if (!user) return null;

    const currentUser = await getUserById(user.id);
    const userRole = currentUser?.role ?? false;

    const orders = await getOrdersByIdAndRole(user.id, userRole);

    return (
        <main className="grid gap-4 [grid-column:content]">
            {orders.length !== 0 ?
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {userRole && (
                        <CreateNewButton
                            userId={user.id}
                            asCard
                        />
                    )}
                    {orders?.map((order) => (
                        <Link
                            href={`/dashboard/${order.id}`}
                            key={order.id}
                            className="group/cardLink"
                        >
                            <Card className="transition-colors group-hover/cardLink:bg-muted">
                                <CardHeader>
                                    <CardTitle className="transition-[letter-spacing] group-hover/cardLink:tracking-wider">
                                        {/* {order.name} */}
                                    </CardTitle>
                                    {"secretMessage" in order && userRole && (
                                        <CardDescription>
                                            {order.secretMessage as string}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <p className="line-clamp-3">
                                        {/* {JSON.stringify(order.orderHeader.assignee)} */}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    {/* <p>{getUserNameById(order.orderHeader.assignee)}</p> */}
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            :   <NoOrderFound
                    userId={user.id}
                    userRole={userRole}
                />
            }
        </main>
    );
}
