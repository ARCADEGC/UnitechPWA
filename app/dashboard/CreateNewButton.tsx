"use client";

import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

import { CreateOrder } from "@/db/db";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Typography } from "@/components/ui/Typography";

function CreateNewButton({
    id,
    name,
    asCard = false,
}: {
    id: string;
    name?: string;
    asCard?: boolean;
}) {
    const router = useRouter();

    async function onClickCreateOrder(order: { id: string; name?: string }) {
        try {
            const newOrderId = await CreateOrder(order);
            router.push(`/dashboard/${newOrderId}`);
            router.refresh();
            setTimeout(() => toast.success("Order created successfully."), 500);
        } catch {
            toast.error("Something went wrong", {
                description: "Please wait or try refreshing the page",
            });
        }
    }

    return asCard ?
            <Button
                variant={"outline"}
                className="group/createNewCard h-full"
                onClick={() => onClickCreateOrder({ id, name })}
            >
                <Typography
                    variant="h4"
                    as="p"
                    className="flex items-center gap-2 tracking-wide text-muted-foreground transition-colors group-hover/createNewCard:text-foreground"
                >
                    <Plus className="size-6" />
                    Create New Order
                </Typography>
            </Button>
        :   <Button onClick={() => onClickCreateOrder({ id, name })}>Create New Order</Button>;
}

export { CreateNewButton };
