"use client";

import { TOrderPP2 } from "@/types/dbSchemas";
import { formPP2Schema } from "@/types/orderForm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignatureCanvas from "react-signature-canvas";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { OrderPP2 } from "@/db/schema";
import { updateOrderPP2 } from "@/db/db";

type TPP2Props = {
    orderPP2: TOrderPP2;
    userRole: boolean;
    referenceDate: Date | undefined;
};

function PP2({ orderPP2, userRole, referenceDate }: TPP2Props) {
    let workerSigCanvasRef = useRef<SignatureCanvas>(null);
    let custommerSigCanvasRef = useRef<SignatureCanvas>(null);

    const form = useForm<z.infer<typeof formPP2Schema>>({
        resolver: zodResolver(formPP2Schema),
        defaultValues: {
            anotherService: orderPP2.anotherService ?? false,
            timeToFinish: String(orderPP2.timeToFinish),
            contactWithIkea: orderPP2.contactWithIkea ?? false,
            numOfReturn: String(orderPP2.numOfReturn),
            canceled: String(orderPP2.finished),
            reasonOfCancelation: String(orderPP2.reasonOfCancelation),
            reasonOfImposibility: String(orderPP2.reasonOfImposibility),
            waterConnection: orderPP2.waterConnection ?? false,
            couplingsAndKitchenAdjustment: orderPP2.couplingsAndKitchenAdjustment ?? false,
            testDishwasherFaucet: orderPP2.testDishwasherFaucet ?? false,
            viewCutsOk: orderPP2.viewCutsOk ?? false,
            electricalAppliancesPluggedIn: orderPP2.electricalAppliancesPluggedIn ?? false,
            cleaningOfKitchenInstallationArea: orderPP2.cleaningOfKitchenInstallationArea ?? false,
            electricalTestAppliances: orderPP2.electricalTestAppliances ?? false,
            previousDamageToApartment: orderPP2.previousDamageToApartment ?? false,
            sealingOfWorktops: orderPP2.sealingOfWorktops ?? false,
            damageToFlatDuringInstallation: orderPP2.damageToFlatDuringInstallation ?? false,
            comment: orderPP2.comment ?? "",

            upperLocker: String(orderPP2.upperLocker),
            lowerLocker: String(orderPP2.lowerLocker),
            highLocker: String(orderPP2.highLocker),
            milledJoint: String(orderPP2.milledJoint),
            worktop: String(orderPP2.worktop),
            tailoredWorktop: String(orderPP2.tailoredWorktop),
            wallPanel: String(orderPP2.wallPanel),
            atypical: String(orderPP2.atypical),
            unnecessary: String(orderPP2.unnecessary),
            kitchen: String(orderPP2.kitchen),
            lights: String(orderPP2.lights),
            ikea: String(orderPP2.ikea),
            nonIkea: String(orderPP2.nonIkea),
            ikeaGas: String(orderPP2.ikeaGas),
            nonIkeaGas: String(orderPP2.nonIkeaGas),

            date: orderPP2.date,
            workerSignature: orderPP2.workerSignature,
            custommerSignature: orderPP2.custommerSignature,
        },
        mode: "all",
    });

    async function onSubmit(values: z.infer<typeof formPP2Schema>) {
        console.log(values);
        try {
            const updatedOrder: TOrderPP2 = {
                workerSignature: workerSigCanvasRef.current?.toData() as SignaturePad.Point[][],
                custommerSignature:
                    custommerSigCanvasRef.current?.toData() as SignaturePad.Point[][],
                date: values.date,
            };

            const promise = updateOrderPP2(OrderPP2.id as string, updatedOrder, userRole);

            toast.promise(promise, {
                loading: "Updating order...",
                success: () => {
                    return "Order updated successfully";
                },
                error: () => {
                    console.log(promise);
                    return "Something went wrong";
                },
            });
        } catch {
            return toast.error("Something went wrong", {
                description: "Please wait or try again",
            });
        }
    }

    useEffect(() => {
        form.getValues().workerSignature ?
            workerSigCanvasRef.current?.fromData(
                form.getValues().workerSignature as SignaturePad.Point[][],
            )
        :   workerSigCanvasRef.current?.clear();
    }, [form]);

    useEffect(() => {
        form.getValues().custommerSignature ?
            custommerSigCanvasRef.current?.fromData(
                form.getValues().custommerSignature as SignaturePad.Point[][],
            )
        :   custommerSigCanvasRef.current?.clear();
    }, [form]);

    return <div>PP2</div>;
}

export default PP2;
