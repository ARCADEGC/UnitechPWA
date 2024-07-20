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
            await deleteOrder(order?.id ?? "");
            toast("Order deleted successfully");
            router.push("/dashboard");
            router.refresh();
        } catch {
            toast("There was an error deleting the order");
        }
    }

    return (
        <AlertDialog>
            <Button
                variant={"destructive"}
                className="flex items-center gap-x-2"
                type="button"
                asChild
            >
                <AlertDialogTrigger>
                    <Trash className="size-4" />
                    Delete Order
                </AlertDialogTrigger>
            </Button>

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
                    <Button
                        variant={"destructive"}
                        asChild
                    >
                        <AlertDialogAction
                            onClick={DeleteOrder}
                            className="flex items-center gap-x-2"
                        >
                            <Trash className="size-4" />
                            Delete
                        </AlertDialogAction>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { DeleteOrderButton };
