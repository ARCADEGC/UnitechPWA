import React, { Suspense, lazy } from "react";

import { validateSession } from "@/auth";
import {
    getUserById,
    getOrderByIdAndRole,
    getOrderHeaderByIdAndRoleOrUser,
    getOrderNewPCKByIdAndRoleOrUser,
} from "@/db/db";

import { NotFound } from "@/app/dashboard/[id]/NotFound";
import Loading from "@/app/loading";
import { DeleteOrderButton } from "./DeteteOrderButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/formTabs";
import { User } from "lucia";
import { Separator } from "@/components/ui/separator";

// const OrderFormWithNoSSR = lazy(() => import("@/app/dashboard/[id]/OrderForm"));

const FormHeader = lazy(() => import("@/app/dashboard/[id]/(forms)/FormHeader"));
const PCK = lazy(() => import("@/app/dashboard/[id]/(forms)/PCK"));

async function Home({ params }: { params: { id: string } }) {
    const { user } = await validateSession();

    if (!user) return null;

    const currentUser = await getUserById(user.id);
    const userRole = currentUser?.role ?? false;

    let currentOrder = await getOrderByIdAndRole(params.id, userRole);

    if (!currentOrder) return <NotFound />;

    const orderHeader = await getOrderHeaderByIdAndRoleOrUser(
        currentOrder?.orderHeader ?? "",
        userRole,
        user.id,
    );

    async function tabChangeToPCK(user: User) {
        const orderNewPCK = await getOrderNewPCKByIdAndRoleOrUser(
            currentOrder?.orderNewPCK ?? "",
            userRole,
            user.id,
        );

        return orderNewPCK ?
                <PCK
                    orderNewPCK={orderNewPCK}
                    userRole={userRole}
                    referenceDate={currentOrder?.referenceDate}
                />
            :   <div>There was an error fetching order new PCK. Please try again.</div>;
    }

    return (
        <Suspense fallback={<Loading />}>
            {orderHeader ?
                <FormHeader
                    orderHeader={orderHeader}
                    userRole={userRole}
                />
            :   <div>There was an error fetching order header. Please try again.</div>}

            {/* <OrderFormWithNoSSR
                order={currentOrder}
                userRole={userRole}
            /> */}

            <Separator className="my-16" />

            <Tabs
                defaultValue="pck"
                className="mt-8 w-full space-y-8"
            >
                <TabsList className="w-full *:w-full">
                    <TabsTrigger value="pck">PCK</TabsTrigger>
                    <TabsTrigger value="pp2">PP 2</TabsTrigger>
                </TabsList>

                <TabsContent value="pck">{tabChangeToPCK(user)}</TabsContent>

                <TabsContent value="pp2"></TabsContent>
            </Tabs>

            <Separator className="my-16" />

            <DeleteOrderButton currentOrder={currentOrder} />
        </Suspense>
    );
}

export default Home;
