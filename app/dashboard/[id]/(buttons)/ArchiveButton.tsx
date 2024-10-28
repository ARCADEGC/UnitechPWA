"use client";

import { Archive } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { archiveOrder } from "@/db/db";

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

function ArchiveButton({ currentOrder }: { currentOrder: TOrder }) {
    const router = useRouter();

    async function ArchiveOrder() {
        const promise = archiveOrder(currentOrder)
            .then(() => router.push("/dashboard"))
            .then(() => router.refresh());

        toast.promise(promise, {
            loading: "Archivace objednávky...",
            success: () => {
                return "Objednávka úspěšně archivována";
            },
            error: () => {
                return "Nastala chyba při archivaci objednávky";
            },
        });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="mb-[35svh] flex h-9 items-center justify-center gap-x-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                <Archive className="size-4" />
                Archivovat objednávku
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Jste si opravdu jisti?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Zrušit</AlertDialogCancel>

                    <AlertDialogAction className="bg-transparent px-0">
                        <Button
                            variant={"default"}
                            className="flex items-center gap-x-2"
                            type="button"
                            onClick={ArchiveOrder}
                        >
                            <Archive className="size-4" />
                            Archivovat
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { ArchiveButton };
