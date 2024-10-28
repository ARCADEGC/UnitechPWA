"use client";

import { Trash } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteOrder } from "@/db/db";

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

import { TOrder } from "@/types/dbSchemas";

function DeleteOrderButton({ currentOrder }: { currentOrder: TOrder }) {
    const router = useRouter();

    async function DeleteOrder() {
        const promise = deleteOrder(currentOrder)
            .then(() => router.push("/dashboard"))
            .then(() => router.refresh());

        toast.promise(promise, {
            loading: "Mazání objednávky...",
            success: () => {
                return "Objednávka smazána úspěšně";
            },
            error: () => {
                return "Nastala chyba při mazání objednávky";
            },
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="mb-[35svh] flex h-9 items-center justify-center gap-x-2 whitespace-nowrap rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <Trash className="size-4" />
                Smazat objednávku
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Jste si opravdu jisti?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tato akci nelze vrátit zpět. Permanentrně smažete objednávku a odstraníte
                        data z našich serverů.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Zrušit</AlertDialogCancel>

                    <AlertDialogAction className="bg-transparent px-0">
                        <Button
                            variant={"destructive"}
                            className="flex items-center gap-x-2"
                            type="button"
                            onClick={DeleteOrder}
                        >
                            <Trash className="size-4" />
                            Smazat
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { DeleteOrderButton };
