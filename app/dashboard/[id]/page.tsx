import React, { Suspense, lazy } from "react";

import { validateSession } from "@/auth";
import {
    getUserById,
    getOrderByIdAndRole,
    getOrderHeaderByIdAndRoleOrUser,
    getOrderNewPCKByIdAndRoleOrUser,
    getOrderPP2ByIdAndRoleOrUser,
} from "@/db/db";

import { NotFound } from "@/app/dashboard/[id]/NotFound";
import Loading from "@/app/loading";
import { DeleteOrderButton } from "./DeteteOrderButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/formTabs";
import { User } from "lucia";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/Typography";

// const OrderFormWithNoSSR = lazy(() => import("@/app/dashboard/[id]/OrderForm"));

const FormHeader = lazy(() => import("@/app/dashboard/[id]/(forms)/FormHeader"));
const PCK = lazy(() => import("@/app/dashboard/[id]/(forms)/PCK"));
const PP2 = lazy(() => import("@/app/dashboard/[id]/(forms)/PP2"));

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
            :   <div>Nastala chyba při načítání objednávky PCK. Zkuste to prosím znovu.</div>;
    }

    async function tabChangeToPP2(user: User) {
        const orderPP2 = await getOrderPP2ByIdAndRoleOrUser(
            currentOrder?.orderPP2 ?? "",
            userRole,
            user.id,
        );

        return orderPP2 ?
                <PP2
                    orderPP2={orderPP2}
                    userRole={userRole}
                    referenceDate={currentOrder?.referenceDate}
                />
            :   <div>Nastala chyba při načítání objednávky PP 2. Zkuste to prosím znovu.</div>;
    }

    return (
        <Suspense fallback={<Loading />}>
            <Typography
                variant="h1"
                as="p"
                className="mb-8 hidden text-black print:block"
            >
                Unitech
            </Typography>
            {orderHeader ?
                <FormHeader
                    orderHeader={orderHeader}
                    userRole={userRole}
                />
            :   <div>Nastala chyba při načítání objednávky. Zkuste to prosím znovu.</div>}

            {/* <OrderFormWithNoSSR
                order={currentOrder}
                userRole={userRole}
            /> */}

            <Separator className="my-16" />

            <Tabs
                defaultValue="pck"
                className="mx-auto mt-8 w-full max-w-prose space-y-8"
            >
                <TabsList className="w-full *:w-full print:hidden">
                    <TabsTrigger value="pck">PCK</TabsTrigger>
                    <TabsTrigger value="pp2">PP 2</TabsTrigger>
                </TabsList>

                <TabsContent value="pck">{tabChangeToPCK(user)}</TabsContent>

                <TabsContent value="pp2">{tabChangeToPP2(user)}</TabsContent>
            </Tabs>

            <Separator className="my-16" />

            <div className="mx-auto max-w-prose print:hidden">
                <DeleteOrderButton currentOrder={currentOrder} />
            </div>
        </Suspense>
    );
}

export default Home;
