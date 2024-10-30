"use client";

import { Clock } from "lucide-react";

import { addHours } from "date-fns";
import { toast } from "sonner";

import { updateOrderReferenceDate } from "@/db/db";

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

function UpdateReferenceTimeButton({
    id,
    referenceDate
}: {
    id: string;
    referenceDate: Date | string;
}) {
    async function handleUpdateOrderReferenceDate() {
        const promise = updateOrderReferenceDate(id, addHours(new Date(), 2));
        toast.promise(promise, {
            loading: "Aktualizace referenčního času...",
            success: () => {
                return "Referenční čas úspěšně aktualizován";
            },
            error: () => {
                return "Nastala chyba při aktualizaci referenčního času";
            }
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={"outline"}
                    className="flex h-10 items-center gap-2"
                >
                    <Clock className="size-4" />
                    Aktualizovat Referenční čas
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Chcete opravdu aktualizovat referenční čas?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tato akce provede reset referenčního záznamu v databázi. Všechny ceny se
                        budou odvíjet od tohoto záznamu. Momentální záznam je{" "}
                        {referenceDate instanceof Date ?
                            referenceDate.toLocaleString()
                        :   referenceDate}
                        .
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Zrušit</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUpdateOrderReferenceDate}>
                        Aktualizovat
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export { UpdateReferenceTimeButton };
