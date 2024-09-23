"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cubicBezier, motion } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";

import { getPriceAtDate, updateOrderNewPCK } from "@/db/db";

import { Eraser } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TOrderNewPCK } from "@/types/dbSchemas";

import { Unit } from "@/components/ui/unit";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/Typography";

import { formNewPCKSchema } from "@/types/orderForm";

type TPCKProps = {
    orderNewPCK: TOrderNewPCK;
    userRole: boolean;
    referenceDate: Date | undefined;
};

function PCK({ orderNewPCK, userRole, referenceDate }: TPCKProps) {
    let sigCanvasRef = useRef<SignatureCanvas>(null);

    const [shipmentZoneOnePrice, setShipmentZoneOnePrice] = useState<number | undefined>(0);
    const [shipmentZoneTwoPrice, setShipmentZoneTwoPrice] = useState<number | undefined>(0);
    const [shipmentZoneThreePrice, setShipmentZoneThreePrice] = useState<number | undefined>(0);
    const [shipmentZoneFourPrice, setShipmentZoneFourPrice] = useState<number | undefined>(0);

    const [completeInstallationLockersPrice, setCompleteInstallationLockersPrice] = useState<
        number | undefined
    >(undefined);
    const [completeAtypicalPrice, setCompleteAtypicalPrice] = useState<number | undefined>(0);

    const [basicLockersPrice, setBasicLockersPrice] = useState<number | undefined>(undefined);
    const [basicMilledPrice, setBasicMilledPrice] = useState<number | undefined>(undefined);
    const [basicAtypicalPrice, setBasicAtypicalPrice] = useState<number | undefined>(undefined);

    const [installationDigesterPrice, setInstallationDigesterPrice] = useState<number | undefined>(
        0,
    );
    const [installationHobPrice, setInstallationHobPrice] = useState<number | undefined>(undefined);
    const [installationGasHobPrice, setInstallationGasHobPrice] = useState<number | undefined>(0);
    const [installationLightsPrice, setInstallationLightsPrice] = useState<number | undefined>(0);
    const [installationMicrowavePrice, setInstallationMicrowavePrice] = useState<
        number | undefined
    >(undefined);
    const [installationFreezerPrice, setInstallationFreezerPrice] = useState<number | undefined>(0);
    const [installationDishwasherPrice, setInstallationDishwasherPrice] = useState<
        number | undefined
    >(undefined);
    const [installationOvenPrice, setInstallationOvenPrice] = useState<number | undefined>(0);
    const [installationFaucetPrice, setInstallationFaucetPrice] = useState<number | undefined>(0);
    const [installationMilledJointPrice, setInstallationMilledJointPrice] = useState<
        number | undefined
    >(undefined);
    const [installationWorktopPrice, setInstallationWorktopPrice] = useState<number | undefined>(0);
    const [installationWallPanelPrice, setInstallationWallPanelPrice] = useState<
        number | undefined
    >(0);

    const [applianceOutsideOfIkeaPrice, setApplianceOutsideOfIkeaPrice] = useState<
        number | undefined
    >(0);
    const [gasApplianceOutsideOfIkeaPrice, setGasApplianceOutsideOfIkeaPrice] = useState<
        number | undefined
    >(0);

    const form = useForm<z.infer<typeof formNewPCKSchema>>({
        resolver: zodResolver(formNewPCKSchema),
        defaultValues: {
            shipmentZoneOne: String(orderNewPCK.shipmentZoneOne),
            shipmentZoneTwo: String(orderNewPCK.shipmentZoneTwo),
            shipmentZoneThree: String(orderNewPCK.shipmentZoneThree),
            shipmentZoneFour: String(orderNewPCK.shipmentZoneFour),

            completeInstallationLockers: Number(orderNewPCK.completeInstallationLockers),
            completeAtypical: Number(orderNewPCK.completeAtypical),

            basicLockers: Number(orderNewPCK.basicLockers),
            basicMilled: Number(orderNewPCK.basicMilled),
            basicAtypical: Number(orderNewPCK.basicAtypical),

            installationDigester: Number(orderNewPCK.installationDigester),
            installationHob: Number(orderNewPCK.installationHob),
            installationGasHob: Number(orderNewPCK.installationGasHob),
            installationLights: Number(orderNewPCK.installationLights),
            installationMicrowave: Number(orderNewPCK.installationMicrowave),
            installationFreezer: Number(orderNewPCK.installationFreezer),
            installationDishwasher: Number(orderNewPCK.installationDishwasher),
            installationOven: Number(orderNewPCK.installationOven),
            installationFaucet: Number(orderNewPCK.installationFaucet),
            installationMilledJoint: Number(orderNewPCK.installationMilledJoint),
            installationWorktop: Number(orderNewPCK.installationWorktop),
            installationWallPanel: Number(orderNewPCK.installationWallPanel),

            applianceOutsideOfIkea: Number(orderNewPCK.applianceOutsideOfIkea),
            gasApplianceOutsideOfIkea: Number(orderNewPCK.gasApplianceOutsideOfIkea),

            tax: !!orderNewPCK.tax,
            bail: Number(orderNewPCK.bail),
            signature: orderNewPCK.signature,
        },
        mode: "all",
    });

    async function onSubmit(values: z.infer<typeof formNewPCKSchema>) {
        try {
            const updatedOrder: TOrderNewPCK = {
                shipmentZoneOne: String(values.shipmentZoneOne),
                shipmentZoneTwo: String(values.shipmentZoneTwo),
                shipmentZoneThree: String(values.shipmentZoneThree),
                shipmentZoneFour: String(values.shipmentZoneFour),

                completeInstallationLockers: String(values.completeInstallationLockers),
                completeAtypical: String(values.completeAtypical),

                basicLockers: String(values.basicLockers),
                basicMilled: String(values.basicMilled),
                basicAtypical: String(values.basicAtypical),

                installationDigester: String(values.installationDigester),
                installationHob: String(values.installationHob),
                installationGasHob: String(values.installationGasHob),
                installationLights: String(values.installationLights),
                installationMicrowave: String(values.installationMicrowave),
                installationFreezer: String(values.installationFreezer),
                installationDishwasher: String(values.installationDishwasher),
                installationOven: String(values.installationOven),
                installationFaucet: String(values.installationFaucet),
                installationMilledJoint: String(values.installationMilledJoint),
                installationWorktop: String(values.installationWorktop),
                installationWallPanel: String(values.installationWallPanel),

                applianceOutsideOfIkea: String(values.applianceOutsideOfIkea),
                gasApplianceOutsideOfIkea: String(values.gasApplianceOutsideOfIkea),

                tax: values.tax,
                bail: String(values.bail),
                signature: sigCanvasRef.current?.toData() as SignaturePad.Point[][],
            };

            const promise = updateOrderNewPCK(orderNewPCK.id as string, updatedOrder, userRole);

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
        form.getValues().signature ?
            sigCanvasRef.current?.fromData(form.getValues().signature as SignaturePad.Point[][])
        :   sigCanvasRef.current?.clear();
    }, [form]);

    const debouncedSubmit = useCallback(
        debounce(async () => {
            onSubmit(form.getValues());
        }, 500),
        [orderNewPCK, userRole],
    );

    useEffect(() => {
        const subscription = form.watch(async () => {
            if (await form.trigger()) {
                return debouncedSubmit();
            }
        });

        return () => subscription.unsubscribe();
    }, [form, debouncedSubmit, sigCanvasRef.current?.toData()]);

    useEffect(() => {
        const fetchPrice = async () => {
            if (referenceDate) {
                setShipmentZoneOnePrice(
                    Number(
                        await getPriceAtDate("shipment_zone_one", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setShipmentZoneTwoPrice(
                    Number(
                        await getPriceAtDate("shipment_zone_two", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setShipmentZoneThreePrice(
                    Number(
                        await getPriceAtDate("shipment_zone_three", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setShipmentZoneFourPrice(
                    Number(
                        await getPriceAtDate("shipment_zone_four", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setCompleteInstallationLockersPrice(
                    Number(
                        await getPriceAtDate("complete_installation_lockers", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setCompleteAtypicalPrice(
                    Number(
                        await getPriceAtDate("complete_atypical", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setBasicLockersPrice(
                    Number(
                        await getPriceAtDate("basic_lockers", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setBasicMilledPrice(
                    Number(
                        await getPriceAtDate("basic_milled", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setBasicAtypicalPrice(
                    Number(
                        await getPriceAtDate("basic_atypical", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setInstallationDigesterPrice(
                    Number(
                        await getPriceAtDate("installation_digester", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationHobPrice(
                    Number(
                        await getPriceAtDate("installation_hob", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationGasHobPrice(
                    Number(
                        await getPriceAtDate("installation_gas_hob", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationLightsPrice(
                    Number(
                        await getPriceAtDate("installation_lights", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationMicrowavePrice(
                    Number(
                        await getPriceAtDate("installation_microwave", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationFreezerPrice(
                    Number(
                        await getPriceAtDate("installation_freezer", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationDishwasherPrice(
                    Number(
                        await getPriceAtDate("installation_dishwasher", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationOvenPrice(
                    Number(
                        await getPriceAtDate("installation_oven", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationFaucetPrice(
                    Number(
                        await getPriceAtDate("installation_faucet", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationMilledJointPrice(
                    Number(
                        await getPriceAtDate("installation_milled_joint", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationWorktopPrice(
                    Number(
                        await getPriceAtDate("installation_worktop", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setInstallationWallPanelPrice(
                    Number(
                        await getPriceAtDate("installation_wall_panel", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setApplianceOutsideOfIkeaPrice(
                    Number(
                        await getPriceAtDate("appliance_outside_of_ikea", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setGasApplianceOutsideOfIkeaPrice(
                    Number(
                        await getPriceAtDate("gas_appliance_outside_of_ikea", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
            } else {
                toast.error("No reference date");
            }
        };
        fetchPrice();
    }, []);

    return (
        <Form {...form}>
            <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
            >
                <div className="flex items-baseline justify-between gap-x-8">
                    <Typography variant="h2">Shipment Zones</Typography>
                    <Unit
                        value={String(
                            (Number(shipmentZoneOnePrice) ?? 0) *
                                Number(form.getValues().shipmentZoneOne) +
                                (Number(shipmentZoneTwoPrice) ?? 0) *
                                    Number(form.getValues().shipmentZoneTwo) +
                                (Number(shipmentZoneThreePrice) ?? 0) *
                                    Number(form.getValues().shipmentZoneThree) +
                                (Number(shipmentZoneFourPrice) ?? 0) *
                                    Number(form.getValues().shipmentZoneFour),
                        )}
                        className="text-xl font-medium tracking-wider text-foreground"
                        unit=",-"
                    />
                </div>
                <Separator className="!mt-0 mb-8" />

                <div className="grid gap-8 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="shipmentZoneOne"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Shipment Zone One</FormLabel>
                                    <Unit
                                        value={shipmentZoneOnePrice ?? "No price found"}
                                        unit="czk"
                                        per="ks"
                                    />
                                </div>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step=".01"
                                        onFocus={(event) => event.currentTarget.select()}
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="shipmentZoneTwo"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Shipment Zone Two</FormLabel>
                                    <Unit
                                        value={shipmentZoneTwoPrice ?? "No price found"}
                                        unit="czk"
                                        per="ks"
                                    />
                                </div>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step=".01"
                                        onFocus={(event) => event.currentTarget.select()}
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="shipmentZoneThree"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Shipment Zone Three</FormLabel>
                                    <Unit
                                        value={shipmentZoneThreePrice ?? "No price found"}
                                        unit="czk"
                                        per="ks"
                                    />
                                </div>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step=".01"
                                        onFocus={(event) => event.currentTarget.select()}
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="shipmentZoneFour"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Shipment Zone Four</FormLabel>
                                    <Unit
                                        value={shipmentZoneFourPrice ?? "No price found"}
                                        unit="czk"
                                        per="ks"
                                    />
                                </div>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step=".01"
                                        onFocus={(event) => event.currentTarget.select()}
                                        {...field}
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="signature"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Signature</FormLabel>

                            <div className="relative w-fit max-sm:w-full">
                                <FormControl>
                                    {/* TODO: on change should submit*/}
                                    <SignatureCanvas
                                        ref={sigCanvasRef}
                                        canvasProps={{
                                            className:
                                                "h-40 bg-muted rounded-lg w-full sm:w-92 mt-2",
                                        }}
                                        penColor="#000"
                                        clearOnResize={false}
                                    />
                                </FormControl>

                                <Button
                                    type="button"
                                    size={"icon"}
                                    onClick={() => sigCanvasRef.current?.clear()}
                                    variant={"secondary"}
                                    className="absolute -bottom-2 -right-2"
                                >
                                    <Eraser className="size-4" />
                                </Button>
                            </div>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </motion.form>
        </Form>
    );
}

export default PCK;

// completeInstallationLockers: Number(order?.completeInstallationLockers ?? 0),
// completeAtypical: Number(order?.completeAtypical ?? 0),

// basicLockers: Number(order?.basicLockers ?? 0),
// basicMilled: Number(order?.basicMilled ?? 0),
// basicAtypical: Number(order?.basicAtypical ?? 0),

// installationDigester: Number(order?.installationDigester ?? 0),
// installationHob: Number(order?.installationHob ?? 0),
// installationGasHob: Number(order?.installationGasHob ?? 0),
// installationLights: Number(order?.installationLights ?? 0),
// installationMicrowave: Number(order?.installationMicrowave ?? 0),
// installationFreezer: Number(order?.installationFreezer ?? 0),
// installationDishwasher: Number(order?.installationDishwasher ?? 0),
// installationOven: Number(order?.installationOven ?? 0),
// installationFaucet: Number(order?.installationFaucet ?? 0),
// installationMilledJoint: Number(order?.installationMilledJoint ?? 0),
// installationWorktop: Number(order?.installationWorktop ?? 0),
// installationWallPanel: Number(order?.installationWallPanel ?? 0),

// applianceOutsideOfIkea: Number(order?.applianceOutsideOfIkea ?? 0),
// gasApplianceOutsideOfIkea: Number(order?.gasApplianceOutsideOfIkea ?? 0),

// tax: order?.tax ?? false,
// bail: order?.bail ?? undefined,
// signature: order?.signature ?? null,
