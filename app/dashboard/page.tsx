import { eq } from "drizzle-orm";

import { validateSession } from "@/auth";
import { db } from "@/db/migrate";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Header } from "@/components/Header/Header";

export default async function Home() {
    const { user } = await validateSession();

    let orders,
        userRole: "ADMIN" | "USER" | null | undefined = null;

    if (user) {
        const currentUser = await db.query.User.findFirst({
            where: (table) => eq(table.id, user.id),
            columns: {
                role: true,
            },
        });

        userRole = currentUser?.role;

        if (userRole === "ADMIN") {
            orders = await db.query.order.findMany();
        }

        if (userRole === "USER") {
            orders = await db.query.order.findMany({
                where: (table) => eq(table.author, user.id),
                columns: {
                    id: true,
                    name: true,
                    content: true,
                    author: true,
                },
            });
        }
    }

    async function getUserName(authorId: string) {
        const user = await db.query.User.findFirst({
            where: (table) => eq(table.id, authorId),
        });

        return user?.name ?? null;
    }

    return (
        <main className="[grid-column:content]">
            <Header />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders?.map((order) => (
                    <Card key={order.id}>
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
                            <p>{getUserName(order.author)}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    );
}
