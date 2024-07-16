import { validateSession } from "@/auth";
import { getUserById, getOrderByIdAndRole } from "@/db/db";

import { NotFound } from "@/app/dashboard/[id]/NotFound";

import { PromiseType } from "@/types/helpers";

import { Input } from "@/components/ui/input";

async function Home({ params }: { params: { id: string } }) {
    const { user } = await validateSession();

    if (!user) return null;

    const currentUser = await getUserById(user.id);
    const userRole = currentUser?.role ?? false;

    let currentOrder: PromiseType<typeof getOrderByIdAndRole> = undefined;

    currentOrder = await getOrderByIdAndRole(params.id, userRole);

    if (!currentOrder) return <NotFound />;

    return (
        <div>
            <Input defaultValue={currentOrder.name} />

            <Input defaultValue={JSON.stringify(currentOrder.content)}></Input>
            <Input defaultValue={currentOrder.author}></Input>

            {"secretMessage" in currentOrder && userRole && (
                <Input defaultValue={currentOrder.secretMessage as string}></Input>
            )}
        </div>
    );
}

export default Home;
