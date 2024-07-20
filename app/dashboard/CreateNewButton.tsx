"use client";

import { useRouter } from "next/navigation";

import { CreateOrder } from "@/db/db";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function CreateNewButton({ id, name }: { id: string; name?: string }) {
    const router = useRouter();

    async function onClickCreateOrder(order: { id: string; name?: string }) {
        try {
            const newOrderId = await CreateOrder(order);
            toast("Successfully created new order.");
            router.push(`/dashboard/${newOrderId}`);
            router.refresh();
        } catch {
            toast("Something went wrong. Please wait or try refreshing the page.");
        }
    }

    return <Button onClick={() => onClickCreateOrder({ id, name })}>Create New Order</Button>;
}

export { CreateNewButton };
