"use client";

import { useState } from "react";

import Link from "next/link";

import { Typography } from "@/components/ui/Typography";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { CreateNewButton } from "@/app/dashboard/CreateNewButton";

type TOrderListProps = {
    orders: {
        id: string | undefined;
        name: string | undefined;
        orderNumber: string;
        assignee: string | null;
        archived: boolean;
    }[];
    role: boolean;
    userId: string;
};

function OrderList({ orders, role, userId }: TOrderListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOrders = orders.filter((order) =>
        order.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const queriedOrders = searchQuery ? filteredOrders : orders;

    return (
        <div className="flex flex-col gap-4">
            <Input
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat..."
                autoFocus
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {role && !searchQuery && (
                    <CreateNewButton
                        userId={userId}
                        asCard
                    />
                )}
                {queriedOrders.length > 0 &&
                    queriedOrders?.map(
                        (order) =>
                            !order.archived && (
                                <Link
                                    href={`/dashboard/${order.id}`}
                                    key={order.id}
                                    className="group/cardLink"
                                >
                                    <Card className="transition-colors group-hover/cardLink:bg-muted">
                                        <CardHeader>
                                            <CardTitle className="transition-[letter-spacing] group-hover/cardLink:tracking-wider">
                                                {order.name}
                                            </CardTitle>
                                            <CardDescription>{order.orderNumber}</CardDescription>
                                        </CardHeader>
                                        {/*
                        <CardContent>
                            <p className="line-clamp-3"></p>
                        </CardContent>
                        */}
                                        <CardFooter>
                                            <p>{order.assignee}</p>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ),
                    )}
            </div>

            {queriedOrders.filter((order) => order.archived).length > 0 && (
                <Typography
                    variant="h2"
                    as="p"
                    className="mt-16 border-b border-border"
                >
                    Archivované objednávky
                </Typography>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {queriedOrders.length > 0 &&
                    queriedOrders?.map(
                        (order) =>
                            order.archived && (
                                <Link
                                    href={`/dashboard/${order.id}`}
                                    key={order.id}
                                    className="group/cardLink"
                                >
                                    <Card className="transition-colors group-hover/cardLink:bg-muted">
                                        <CardHeader>
                                            <CardTitle className="transition-[letter-spacing] group-hover/cardLink:tracking-wider">
                                                {order.name}
                                            </CardTitle>
                                            <CardDescription>{order.orderNumber}</CardDescription>
                                        </CardHeader>
                                        {/*
                        <CardContent>
                            <p className="line-clamp-3"></p>
                        </CardContent>
                        */}
                                        <CardFooter>
                                            <p>{order.assignee}</p>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ),
                    )}
            </div>

            {searchQuery && queriedOrders.length === 0 && (
                <Typography
                    variant="h1"
                    as="p"
                    className="col-span-3 mx-auto my-24"
                >
                    Žádné výsledky
                </Typography>
            )}
        </div>
    );
}

export { OrderList };
