import { validateSession } from "@/auth";
import { getAdminOrderById, getUserById, getUserOrderById } from "@/db/db";

import { NotFound } from "@/app/dashboard/[id]/NotFound";

import { PromiseType } from "@/types/helpers";

async function Home({ params }: { params: { id: string } }) {
    const { user } = await validateSession();

    if (!user) return null;

    const currentUser = await getUserById(user.id);
    const userRole = currentUser?.role;

    let currentOrder: PromiseType<typeof getAdminOrderById> | PromiseType<typeof getUserOrderById> =
        [];

    if (userRole === "ADMIN") {
        currentOrder = await getAdminOrderById(params.id);
    }

    if (userRole === "USER") {
        currentOrder = await getUserOrderById(params.id);
    }

    if (currentOrder.length === 0) return <NotFound />;

    return (
        <div>
            {currentOrder.map((order) =>
                Object.entries(order).map(([key, value]) => (
                    <p key={key}>{typeof value === "string" ? value : JSON.stringify(value)}</p>
                )),
            )}
        </div>
    );
}

export default Home;
