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
    FormDescription,
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
import { Switch } from "@/components/ui/switch";

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
    >(0);
    const [completeAtypicalPrice, setCompleteAtypicalPrice] = useState<number | undefined>(0);

    const [basicLockersPrice, setBasicLockersPrice] = useState<number | undefined>(0);
    const [basicMilledPrice, setBasicMilledPrice] = useState<number | undefined>(0);
    const [basicAtypicalPrice, setBasicAtypicalPrice] = useState<number | undefined>(0);

    const [installationDigesterPrice, setInstallationDigesterPrice] = useState<number | undefined>(
        0,
    );
    const [installationHobPrice, setInstallationHobPrice] = useState<number | undefined>(0);
    const [installationGasHobPrice, setInstallationGasHobPrice] = useState<number | undefined>(0);
    const [installationLightsPrice, setInstallationLightsPrice] = useState<number | undefined>(0);
    const [installationMicrowavePrice, setInstallationMicrowavePrice] = useState<
        number | undefined
    >(0);
    const [installationFreezerPrice, setInstallationFreezerPrice] = useState<number | undefined>(0);
    const [installationDishwasherPrice, setInstallationDishwasherPrice] = useState<
        number | undefined
    >(0);
    const [installationOvenPrice, setInstallationOvenPrice] = useState<number | undefined>(0);
    const [installationFaucetPrice, setInstallationFaucetPrice] = useState<number | undefined>(0);
    const [installationMilledJointPrice, setInstallationMilledJointPrice] = useState<
        number | undefined
    >(0);
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

            completeInstallationLockers: String(orderNewPCK.completeInstallationLockers),
            completeAtypical: String(orderNewPCK.completeAtypical),

            basicLockers: String(orderNewPCK.basicLockers),
            basicMilled: String(orderNewPCK.basicMilled),
            basicAtypical: String(orderNewPCK.basicAtypical),

            installationDigester: String(orderNewPCK.installationDigester),
            installationHob: String(orderNewPCK.installationHob),
            installationGasHob: String(orderNewPCK.installationGasHob),
            installationLights: String(orderNewPCK.installationLights),
            installationMicrowave: String(orderNewPCK.installationMicrowave),
            installationFreezer: String(orderNewPCK.installationFreezer),
            installationDishwasher: String(orderNewPCK.installationDishwasher),
            installationOven: String(orderNewPCK.installationOven),
            installationFaucet: String(orderNewPCK.installationFaucet),
            installationMilledJoint: String(orderNewPCK.installationMilledJoint),
            installationWorktop: String(orderNewPCK.installationWorktop),
            installationWallPanel: String(orderNewPCK.installationWallPanel),

            applianceOutsideOfIkea: String(orderNewPCK.applianceOutsideOfIkea),
            gasApplianceOutsideOfIkea: String(orderNewPCK.gasApplianceOutsideOfIkea),

            tax: !!orderNewPCK.tax,
            bail: String(orderNewPCK.bail),
            signature: orderNewPCK.signature,
        },
        mode: "all",
    });

    async function onSubmit(values: z.infer<typeof formNewPCKSchema>) {
        try {
            const updatedOrder: TOrderNewPCK = {
                shipmentZoneOne: String(
                    values.shipmentZoneOne === "null" ? 0 : values.shipmentZoneOne,
                ),
                shipmentZoneTwo: String(
                    values.shipmentZoneTwo === "null" ? 0 : values.shipmentZoneTwo,
                ),
                shipmentZoneThree: String(
                    values.shipmentZoneThree === "null" ? 0 : values.shipmentZoneThree,
                ),
                shipmentZoneFour: String(
                    values.shipmentZoneFour === "null" ? 0 : values.shipmentZoneFour,
                ),

                completeInstallationLockers: String(
                    values.completeInstallationLockers === "null" ?
                        0
                    :   values.completeInstallationLockers,
                ),
                completeAtypical: String(
                    values.completeAtypical === "null" ? 0 : values.completeAtypical,
                ),

                basicLockers: String(values.basicLockers === "null" ? 0 : values.basicLockers),
                basicMilled: String(values.basicMilled === "null" ? 0 : values.basicMilled),
                basicAtypical: String(values.basicAtypical === "null" ? 0 : values.basicAtypical),

                installationDigester: String(
                    values.installationDigester === "null" ? 0 : values.installationDigester,
                ),
                installationHob: String(
                    values.installationHob === "null" ? 0 : values.installationHob,
                ),
                installationGasHob: String(
                    values.installationGasHob === "null" ? 0 : values.installationGasHob,
                ),
                installationLights: String(
                    values.installationLights === "null" ? 0 : values.installationLights,
                ),
                installationMicrowave: String(
                    values.installationMicrowave === "null" ? 0 : values.installationMicrowave,
                ),
                installationFreezer: String(
                    values.installationFreezer === "null" ? 0 : values.installationFreezer,
                ),
                installationDishwasher: String(
                    values.installationDishwasher === "null" ? 0 : values.installationDishwasher,
                ),
                installationOven: String(
                    values.installationOven === "null" ? 0 : values.installationOven,
                ),
                installationFaucet: String(
                    values.installationFaucet === "null" ? 0 : values.installationFaucet,
                ),
                installationMilledJoint: String(
                    values.installationMilledJoint === "null" ? 0 : values.installationMilledJoint,
                ),
                installationWorktop: String(
                    values.installationWorktop === "null" ? 0 : values.installationWorktop,
                ),
                installationWallPanel: String(
                    values.installationWallPanel === "null" ? 0 : values.installationWallPanel,
                ),

                applianceOutsideOfIkea: String(
                    values.applianceOutsideOfIkea === "null" ? 0 : values.applianceOutsideOfIkea,
                ),
                gasApplianceOutsideOfIkea: String(
                    values.gasApplianceOutsideOfIkea === "null" ?
                        0
                    :   values.gasApplianceOutsideOfIkea,
                ),

                tax: values.tax,
                bail: String(values.bail === "null" ? 0 : values.bail),
                signature: sigCanvasRef.current?.toData() as SignaturePad.Point[][],
            };

            const promise = updateOrderNewPCK(orderNewPCK.id as string, updatedOrder, userRole);

            toast.promise(promise, {
                loading: "Updating order...",
                success: () => {
                    return "Order updated successfully";
                },
                error: () => {
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
                        await getPriceAtDate("installation_sink", referenceDate).then(
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

    const calculateShipmentZoneTotal = (
        price: number | undefined,
        quantity: string | undefined,
    ): number => {
        return (Number(price) || 0) * (Number(quantity) || 0);
    };

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
                            calculateShipmentZoneTotal(
                                shipmentZoneOnePrice,
                                form.getValues().shipmentZoneOne,
                            ) +
                                calculateShipmentZoneTotal(
                                    shipmentZoneTwoPrice,
                                    form.getValues().shipmentZoneTwo,
                                ) +
                                calculateShipmentZoneTotal(
                                    shipmentZoneThreePrice,
                                    form.getValues().shipmentZoneThree,
                                ) +
                                calculateShipmentZoneTotal(
                                    shipmentZoneFourPrice,
                                    form.getValues().shipmentZoneFour,
                                ),
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

                <div className="flex items-baseline justify-between gap-x-8">
                    <Typography variant="h2">Complete Installation</Typography>
                    <Unit
                        value={String(
                            calculateShipmentZoneTotal(
                                completeInstallationLockersPrice,
                                form.getValues().completeInstallationLockers,
                            ) +
                                calculateShipmentZoneTotal(
                                    completeAtypicalPrice,
                                    form.getValues().completeAtypical,
                                ),
                        )}
                        className="text-xl font-medium tracking-wider text-foreground"
                        unit=",-"
                    />
                </div>

                <Separator className="!mt-0 mb-8" />

                <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="completeInstallationLockers"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Complete Installation Lockers</FormLabel>
                                    <Unit
                                        value={completeInstallationLockersPrice ?? "No price found"}
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
                        name="completeAtypical"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Complete Atypical</FormLabel>
                                    <Unit
                                        value={completeAtypicalPrice ?? "No price found"}
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

                <div className="flex items-baseline justify-between gap-x-8">
                    <Typography variant="h2">Basic Products</Typography>
                    <Unit
                        value={String(
                            calculateShipmentZoneTotal(
                                basicLockersPrice,
                                form.getValues().basicLockers,
                            ) +
                                calculateShipmentZoneTotal(
                                    basicMilledPrice,
                                    form.getValues().basicMilled,
                                ) +
                                calculateShipmentZoneTotal(
                                    basicAtypicalPrice,
                                    form.getValues().basicAtypical,
                                ),
                        )}
                        className="text-xl font-medium tracking-wider text-foreground"
                        unit=",-"
                    />
                </div>

                <Separator className="!mt-0 mb-8" />

                <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="basicLockers"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Basic Lockers</FormLabel>
                                    <Unit
                                        value={basicLockersPrice ?? "No price found"}
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
                        name="basicMilled"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Basic Millered</FormLabel>
                                    <Unit
                                        value={basicMilledPrice ?? "No price found"}
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
                        name="basicAtypical"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Basic Atypical</FormLabel>
                                    <Unit
                                        value={basicAtypicalPrice ?? "No price found"}
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

                <div className="flex items-baseline justify-between gap-x-8">
                    <Typography variant="h2">Installation</Typography>
                    <Unit
                        value={String(
                            calculateShipmentZoneTotal(
                                installationDigesterPrice,
                                form.getValues().installationDigester,
                            ) +
                                calculateShipmentZoneTotal(
                                    installationHobPrice,
                                    form.getValues().installationHob,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationGasHobPrice,
                                    form.getValues().installationGasHob,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationLightsPrice,
                                    form.getValues().installationLights,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationMicrowavePrice,
                                    form.getValues().installationMicrowave,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationFreezerPrice,
                                    form.getValues().installationFreezer,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationDishwasherPrice,
                                    form.getValues().installationDishwasher,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationOvenPrice,
                                    form.getValues().installationOven,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationFaucetPrice,
                                    form.getValues().installationFaucet,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationMilledJointPrice,
                                    form.getValues().installationMilledJoint,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationWorktopPrice,
                                    form.getValues().installationWorktop,
                                ) +
                                calculateShipmentZoneTotal(
                                    installationWallPanelPrice,
                                    form.getValues().installationWallPanel,
                                ) +
                                calculateShipmentZoneTotal(
                                    applianceOutsideOfIkeaPrice,
                                    form.getValues().applianceOutsideOfIkea,
                                ) +
                                calculateShipmentZoneTotal(
                                    gasApplianceOutsideOfIkeaPrice,
                                    form.getValues().gasApplianceOutsideOfIkea,
                                ),
                        )}
                        className="text-xl font-medium tracking-wider text-foreground"
                        unit=",-"
                    />
                </div>

                <Separator className="!mt-0 mb-8" />

                <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="installationDigester"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Digester</FormLabel>
                                    <Unit
                                        value={installationDigesterPrice ?? "No price found"}
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
                        name="installationHob"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation HOB</FormLabel>
                                    <Unit
                                        value={installationHobPrice ?? "No price found"}
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
                        name="installationGasHob"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Gas HOB</FormLabel>
                                    <Unit
                                        value={installationGasHobPrice ?? "No price found"}
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
                        name="installationLights"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Lights</FormLabel>
                                    <Unit
                                        value={installationLightsPrice ?? "No price found"}
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
                        name="installationMicrowave"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Microwave</FormLabel>
                                    <Unit
                                        value={installationMicrowavePrice ?? "No price found"}
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
                        name="installationFreezer"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Freezer</FormLabel>
                                    <Unit
                                        value={installationFreezerPrice ?? "No price found"}
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
                        name="installationDishwasher"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Dishwasher</FormLabel>
                                    <Unit
                                        value={installationDishwasherPrice ?? "No price found"}
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
                        name="installationOven"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Oven</FormLabel>
                                    <Unit
                                        value={installationOvenPrice ?? "No price found"}
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
                        name="installationFaucet"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Faucet</FormLabel>
                                    <Unit
                                        value={installationFaucetPrice ?? "No price found"}
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
                        name="installationMilledJoint"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Millered Joint</FormLabel>
                                    <Unit
                                        value={installationMilledJointPrice ?? "No price found"}
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
                        name="installationWorktop"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Worktop</FormLabel>
                                    <Unit
                                        value={installationWorktopPrice ?? "No price found"}
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
                        name="installationWallPanel"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Wall Panel</FormLabel>
                                    <Unit
                                        value={installationWallPanelPrice ?? "No price found"}
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
                        name="applianceOutsideOfIkea"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Appliance Outside of Ikea</FormLabel>
                                    <Unit
                                        value={applianceOutsideOfIkeaPrice ?? "No price found"}
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
                        name="installationFreezer"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline gap-x-2">
                                    <FormLabel>Installation Freezer</FormLabel>
                                    <Unit
                                        value={installationFreezerPrice ?? "No price found"}
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

                <div className="grid gap-8 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="bail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bail</FormLabel>
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
                        name="tax"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax</FormLabel>

                                <FormControl>
                                    <div className="flex gap-x-2">
                                        <Typography
                                            variant="muted"
                                            as="p"
                                        >
                                            21%
                                        </Typography>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                        <Typography
                                            variant="muted"
                                            as="p"
                                        >
                                            12%
                                        </Typography>
                                    </div>
                                </FormControl>
                                <FormDescription>Let the tax be 12% instead of 21%</FormDescription>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="signature"
                    render={({ field }) => (
                        <FormItem className="ml-auto w-fit">
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
