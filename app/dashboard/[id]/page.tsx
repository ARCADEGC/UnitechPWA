import React, { Suspense, lazy } from "react";

import { validateSession } from "@/auth";
import { getUserById, getOrderByIdAndRole } from "@/db/db";

import { NotFound } from "@/app/dashboard/[id]/NotFound";
import Loading from "@/app/loading";

const OrderFormWithNoSSR = lazy(() => import("@/app/dashboard/[id]/OrderForm"));

async function Home({ params }: { params: { id: string } }) {
    const { user } = await validateSession();

    if (!user) return null;

    const currentUser = await getUserById(user.id);
    const userRole = currentUser?.role ?? false;

    let currentOrder = await getOrderByIdAndRole(params.id, userRole);

    if (!currentOrder) return <NotFound />;

    return (
        <Suspense fallback={<Loading />}>
            <OrderFormWithNoSSR
                order={currentOrder}
                userRole={userRole}
            />
        </Suspense>
    );
}

export default Home;
