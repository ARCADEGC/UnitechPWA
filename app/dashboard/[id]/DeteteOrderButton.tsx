"use client";

import { useRouter } from "next/navigation";

import { Trash } from "lucide-react";

import { deleteOrder } from "@/db/db";

import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

import { TOrder } from "@/types/dbSchemas";

function DeleteOrderButton({ order }: { order: TOrder }) {
    const router = useRouter();

    async function DeleteOrder() {
        try {
            const promise = deleteOrder(order?.id ?? "")
                .then(() => router.push("/dashboard"))
                .then(() => router.refresh())
                .finally(() => {
                    setTimeout(() => {
                        toast.promise(promise, {
                            loading: "Deleting order...",
                            success: () => {
                                return "Order deleted successfully";
                            },
                        });
                    }, 500);
                });
        } catch {
            toast.error("There was an error deleting the order", {
                description: "Please wait or try refreshing the page",
            });
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    variant={"destructive"}
                    className="flex items-center gap-x-2"
                    type="button"
                >
                    <Trash className="size-4" />
                    Delete Order
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and
                        remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction className="bg-transparent px-0">
                        <Button
                            variant={"destructive"}
                            className="flex items-center gap-x-2"
                            type="button"
                            onClick={DeleteOrder}
                        >
                            <Trash className="size-4" />
                            Delete
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { DeleteOrderButton };
