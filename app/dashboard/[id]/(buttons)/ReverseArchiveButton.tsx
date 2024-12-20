"use client";

import { Archive } from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { unarchiveOrder } from "@/db/db";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { TOrder } from "@/types/dbSchemas";

function ReverseArchiveButton({ currentOrder }: { currentOrder: TOrder }) {
    const router = useRouter();

    async function ReverseArchiveOrder() {
        const promise = unarchiveOrder(currentOrder).then(() => router.refresh());

        toast.promise(promise, {
            loading: "Archivace zrušena...",
            success: () => {
                return "Archivace úspěšně zrušena";
            },
            error: () => {
                return "Nastala chyba při změně archivace objednávky";
            }
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="flex h-10 items-center justify-center gap-x-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <Archive className="size-4" />
                Zrušit archivaci objednávky
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Jste si opravdu jisti?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tímto se zruší archivaci objednávky.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Zrušit</AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <Button
                            variant={"default"}
                            className="flex items-center gap-x-2"
                            type="button"
                            onClick={ReverseArchiveOrder}
                        >
                            <Archive className="size-4" />
                            Zrušit archivaci
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { ReverseArchiveButton };
