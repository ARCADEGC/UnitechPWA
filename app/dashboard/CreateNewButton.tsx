"use client";

import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { CreateOrder } from "@/db/db";

import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";

function CreateNewButton({ userId, asCard = false }: { userId: string; asCard?: boolean }) {
    const router = useRouter();

    async function onClickCreateOrder(userId: string) {
        try {
            const newOrderId = await CreateOrder(userId);
            router.push(`/dashboard/${newOrderId}`);
            router.refresh();
            setTimeout(() => toast.success("Objednávka vytvořena úspěšně."), 500);
        } catch {
            toast.error("Něco se pokazilo", {
                description: "Prosím počkejte nebo zkuste obnovit stránku"
            });
        }
    }

    return asCard ?
            <Button
                variant={"outline"}
                className="group/createNewCard h-full min-h-32"
                onClick={() => onClickCreateOrder(userId)}
            >
                <Typography
                    variant="h4"
                    as="p"
                    className="flex items-center gap-2 tracking-wide text-muted-foreground transition-colors group-hover/createNewCard:text-foreground"
                >
                    <Plus className="size-6" />
                    Vytvořit novou objednávku
                </Typography>
            </Button>
        :   <Button onClick={() => onClickCreateOrder(userId)}>Vytvořit novou objednávku</Button>;
}

export { CreateNewButton };
