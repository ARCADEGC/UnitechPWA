import { Archive, Coins, CreditCard } from "lucide-react";
import React, { Suspense, lazy } from "react";

import { validateSession } from "@/auth";

import {
    getUserById,
    getOrderByIdAndRole,
    getOrderHeaderByIdAndRoleOrUser,
    getOrderNewPCKByIdAndRoleOrUser,
    getOrderPP2ByIdAndRoleOrUser,
    getOrderList1ByIdAndRoleOrUser,
    getOrderPP2SpecificationsByIdAndRoleOrUser
} from "@/db/db";

import { Typography } from "@/components/ui/Typography";
import { Separator } from "@/components/ui/separator";

import { ArchiveButton } from "@/app/dashboard/[id]/(buttons)/ArchiveButton";
import { DeleteOrderButton } from "@/app/dashboard/[id]/(buttons)/DeteteOrderButton";
import { NotFound } from "@/app/dashboard/[id]/NotFound";

import { PaidButton } from "./(buttons)/PaidButton";
import { PrintButton } from "./(buttons)/PrintButton";
import { ReverseArchiveButton } from "./(buttons)/ReverseArchiveButton";
import { UpdateReferenceTimeButton } from "./(buttons)/UpdateReferenceTimeButton";

const FormHeader = lazy(() => import("@/app/dashboard/[id]/(forms)/FormHeader"));

// Create client-side wrappers in separate files
const ClientTabs = lazy(() => import("./clientTabs"));

async function Home(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { user } = await validateSession();

    if (!user) return null;

    const currentUser = await getUserById(user.id);
    const userRole = currentUser?.role ?? false;

    let currentOrder = await getOrderByIdAndRole(params.id, userRole);

    if (!currentOrder) return <NotFound />;

    const orderHeader = await getOrderHeaderByIdAndRoleOrUser(
        currentOrder?.orderHeader ?? "",
        userRole,
        user.id
    );

    // Initial data fetch
    const [orderList1, PP2Specifications, orderNewPCK, orderPP2] = await Promise.all([
        getOrderList1ByIdAndRoleOrUser(currentOrder?.orderListOne ?? "", userRole, user.id),
        getOrderPP2SpecificationsByIdAndRoleOrUser(currentOrder?.orderPP2 ?? "", userRole, user.id),
        getOrderNewPCKByIdAndRoleOrUser(currentOrder?.orderNewPCK ?? "", userRole, user.id),
        getOrderPP2ByIdAndRoleOrUser(currentOrder?.orderPP2 ?? "", userRole, user.id)
    ]);

    return (
        <>
            <div className="mx-auto flex max-w-prose justify-between">
                <Typography
                    variant="h1"
                    as="p"
                    className="mb-8 hidden text-black print:block"
                >
                    Unitech
                </Typography>
                {currentOrder.archived && (
                    <Typography
                        variant="h1"
                        as="p"
                        className="mx-auto mb-12 flex w-fit items-center gap-2 text-muted-foreground print:mr-0"
                    >
                        <Archive className="size-10 stroke-2" />
                        Archivováno
                    </Typography>
                )}
            </div>
            {currentOrder.paid !== "unpaid" && (
                <Typography
                    variant="h1"
                    as="p"
                    className="mx-auto mb-12 flex w-fit items-center gap-2 text-muted-foreground print:mr-0"
                >
                    {currentOrder.paid === "card" && <CreditCard className="size-10 stroke-2" />}
                    {currentOrder.paid === "cash" && <Coins className="size-10 stroke-2" />}
                    Zaplaceno {currentOrder.paid === "card" && "kartou"}
                    {currentOrder.paid === "cash" && "hotově"}
                </Typography>
            )}
            {orderHeader ?
                <FormHeader
                    orderHeader={orderHeader}
                    userRole={userRole}
                    archived={currentOrder.archived ?? true}
                />
            :   <div>Nastala chyba při načítání objednávky. Zkuste to prosím znovu.</div>}

            <Separator className="my-16" />

            <Suspense fallback={<div>Načítání...</div>}>
                <ClientTabs
                    initialData={{
                        pck: orderNewPCK,
                        pp2: orderPP2,
                        list1: orderList1,
                        pp2Specs: PP2Specifications
                    }}
                    userRole={userRole}
                    userId={user.id}
                    orderId={currentOrder.id ?? ""}
                    orderPP2Id={currentOrder.orderPP2 ?? ""}
                    orderListOneId={currentOrder.orderListOne ?? ""}
                    orderNewPCKId={currentOrder.orderNewPCK ?? ""}
                    referenceDate={currentOrder.referenceDate ?? new Date()}
                    archived={currentOrder.archived ?? true}
                />
            </Suspense>

            <Separator className="my-16" />

            <div className="mx-auto flex max-w-prose flex-wrap gap-8 print:hidden">
                {userRole && <DeleteOrderButton currentOrder={currentOrder} />}
                <PrintButton>Tisk</PrintButton>
                {currentOrder.archived ?
                    userRole && <ReverseArchiveButton currentOrder={currentOrder} />
                :   <ArchiveButton currentOrder={currentOrder} />}
                {userRole && (
                    <UpdateReferenceTimeButton
                        id={currentOrder.id ?? ""}
                        referenceDate={currentOrder.referenceDate ?? "(nastala chyba)"}
                    />
                )}
                <PaidButton
                    orderId={currentOrder.id ?? ""}
                    paid={currentOrder.paid ?? "unpaid"}
                />
            </div>
        </>
    );
}

export default Home;
