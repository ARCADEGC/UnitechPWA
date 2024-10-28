"use client";

import { Coins, CreditCard, Wallet } from "lucide-react";

import { updateOrderPaidStatus } from "@/db/db";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { TPaid } from "@/types/dbSchemas";

function PaidButton({ orderId, paid }: { orderId: string; paid: TPaid }) {
    async function changeStatusAndReload(type: TPaid) {
        await updateOrderPaidStatus(orderId, type).then(() => window.location.reload());
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger
                className="h-fit"
                asChild
            >
                <Button
                    variant={"outline"}
                    className="flex gap-2 items-center h-10"
                >
                    {paid === "card" && <CreditCard className="size-4" />}
                    {paid === "cash" && <Coins className="size-4" />}
                    {paid === "unpaid" && <Wallet className="size-4" />}
                    {paid === "unpaid" ? "Nezaplaceno" : "Zaplaceno"}
                    &nbsp;
                    {paid === "card" && "kartou"}
                    {paid === "cash" && "hotově"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Zadejte status zaplacení</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Zde můžete zadat stav zaplacení objednávky.
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Zrušit</AlertDialogCancel>

                    {paid !== "cash" && (
                        <Button
                            onClick={() => changeStatusAndReload("cash")}
                            className="flex gap-2 items-center"
                        >
                            <Coins className="size-4" />
                            Hotově
                        </Button>
                    )}
                    {paid !== "card" && (
                        <Button
                            onClick={() => changeStatusAndReload("card")}
                            className="flex gap-2 items-center"
                        >
                            <CreditCard className="size-4" />
                            Kartou
                        </Button>
                    )}
                    {paid !== "unpaid" && (
                        <Button
                            onClick={() => changeStatusAndReload("unpaid")}
                            variant={"destructive"}
                        >
                            Nezaplaceno
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { PaidButton };
