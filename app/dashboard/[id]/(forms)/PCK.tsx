"use client";

import { Eraser } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { cubicBezier, motion } from "framer-motion";
import { debounce } from "lodash";
import { toast } from "sonner";
import { z } from "zod";

import { getPriceAtDate, updateOrderNewPCK } from "@/db/db";

import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Unit } from "@/components/ui/unit";

import { TOrderNewPCK } from "@/types/dbSchemas";
import { formNewPCKSchema } from "@/types/orderForm";

type TPCKProps = {
    orderNewPCK: TOrderNewPCK;
    userRole: boolean;
    referenceDate: Date | undefined;
    archived: boolean;
};

type SignaturePoints = SignaturePad.Point[][];

function PCK({ orderNewPCK, userRole, referenceDate, archived }: TPCKProps) {
    let sigCanvasRef = useRef<SignatureCanvas>(null);
    const [signatureData, setSignatureData] = useState<SignaturePoints>(
        (orderNewPCK.signature as SignaturePoints) || []
    );

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
        0
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
            signature: (orderNewPCK.signature as SignaturePoints) || []
        },
        mode: "all"
    });

    const onSubmit = useCallback(
        (values: z.infer<typeof formNewPCKSchema>) => {
            try {
                const signature = sigCanvasRef.current?.toData() || [];
                const updatedOrder: TOrderNewPCK = {
                    shipmentZoneOne: String(
                        values.shipmentZoneOne === "null" ? 0 : values.shipmentZoneOne
                    ),
                    shipmentZoneTwo: String(
                        values.shipmentZoneTwo === "null" ? 0 : values.shipmentZoneTwo
                    ),
                    shipmentZoneThree: String(
                        values.shipmentZoneThree === "null" ? 0 : values.shipmentZoneThree
                    ),
                    shipmentZoneFour: String(
                        values.shipmentZoneFour === "null" ? 0 : values.shipmentZoneFour
                    ),

                    completeInstallationLockers: String(
                        values.completeInstallationLockers === "null" ?
                            0
                        :   values.completeInstallationLockers
                    ),
                    completeAtypical: String(
                        values.completeAtypical === "null" ? 0 : values.completeAtypical
                    ),

                    basicLockers: String(values.basicLockers === "null" ? 0 : values.basicLockers),
                    basicMilled: String(values.basicMilled === "null" ? 0 : values.basicMilled),
                    basicAtypical: String(
                        values.basicAtypical === "null" ? 0 : values.basicAtypical
                    ),

                    installationDigester: String(
                        values.installationDigester === "null" ? 0 : values.installationDigester
                    ),
                    installationHob: String(
                        values.installationHob === "null" ? 0 : values.installationHob
                    ),
                    installationGasHob: String(
                        values.installationGasHob === "null" ? 0 : values.installationGasHob
                    ),
                    installationLights: String(
                        values.installationLights === "null" ? 0 : values.installationLights
                    ),
                    installationMicrowave: String(
                        values.installationMicrowave === "null" ? 0 : values.installationMicrowave
                    ),
                    installationFreezer: String(
                        values.installationFreezer === "null" ? 0 : values.installationFreezer
                    ),
                    installationDishwasher: String(
                        values.installationDishwasher === "null" ? 0 : values.installationDishwasher
                    ),
                    installationOven: String(
                        values.installationOven === "null" ? 0 : values.installationOven
                    ),
                    installationFaucet: String(
                        values.installationFaucet === "null" ? 0 : values.installationFaucet
                    ),
                    installationMilledJoint: String(
                        values.installationMilledJoint === "null" ?
                            0
                        :   values.installationMilledJoint
                    ),
                    installationWorktop: String(
                        values.installationWorktop === "null" ? 0 : values.installationWorktop
                    ),
                    installationWallPanel: String(
                        values.installationWallPanel === "null" ? 0 : values.installationWallPanel
                    ),

                    applianceOutsideOfIkea: String(
                        values.applianceOutsideOfIkea === "null" ? 0 : values.applianceOutsideOfIkea
                    ),
                    gasApplianceOutsideOfIkea: String(
                        values.gasApplianceOutsideOfIkea === "null" ?
                            0
                        :   values.gasApplianceOutsideOfIkea
                    ),

                    tax: values.tax,
                    bail: String(values.bail === "null" ? 0 : values.bail),
                    signature: signature
                };

                const promise = updateOrderNewPCK(orderNewPCK.id as string, updatedOrder, userRole);

                toast.promise(promise, {
                    loading: "Aktualizování objednávky...",
                    success: () => {
                        return "Objednávka aktualizována úspěšně";
                    },
                    error: () => {
                        return "Něco se pokazilo";
                    }
                });
            } catch {
                return toast.error("Něco se pokazilo", {
                    description: "Prosím počkejte nebo to zkuste znovu"
                });
            }
        },
        [userRole, orderNewPCK.id]
    );

    const debouncedSubmit = useCallback(
        (values: z.infer<typeof formNewPCKSchema>) => {
            onSubmit(values);
        },
        [onSubmit]
    );

    const debouncedSubmitWithDelay = useMemo(
        () => debounce(debouncedSubmit, 500),
        [debouncedSubmit]
    );

    useEffect(() => {
        const subscription = form.watch(async () => {
            if (await form.trigger()) {
                return debouncedSubmitWithDelay(form.getValues());
            }
        });

        return () => {
            subscription.unsubscribe();
            debouncedSubmitWithDelay.cancel();
        };
    }, [form, debouncedSubmitWithDelay]);

    useEffect(() => {
        signatureData.length > 0 ?
            sigCanvasRef.current?.fromData(signatureData)
        :   sigCanvasRef.current?.clear();
    }, [signatureData]);

    useEffect(() => {
        const subscription = form.watch(() => {
            if (sigCanvasRef.current) {
                const newSignatureData = sigCanvasRef.current.toData();
                setSignatureData(newSignatureData);
            }
        });

        return () => subscription.unsubscribe();
    }, [form]);

    const handleClearSignature = useCallback(() => {
        if (sigCanvasRef.current) {
            sigCanvasRef.current.clear();
            setSignatureData([]);
            form.setValue("signature", [], { shouldValidate: true });
        }
    }, [form]);

    const handleSignatureEnd = useCallback(() => {
        if (sigCanvasRef.current) {
            const newData = sigCanvasRef.current.toData();
            setSignatureData(newData);
            form.setValue("signature", newData, { shouldValidate: true });
        }
    }, [form]);

    useEffect(() => {
        if (form.formState.isValid) {
            debouncedSubmitWithDelay(form.getValues());
        }
    }, [signatureData, debouncedSubmitWithDelay, form]);

    useEffect(() => {
        const fetchPrice = async () => {
            if (referenceDate) {
                setShipmentZoneOnePrice(
                    Number(
                        await getPriceAtDate("shipment_zone_one", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setShipmentZoneTwoPrice(
                    Number(
                        await getPriceAtDate("shipment_zone_two", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setShipmentZoneThreePrice(
                    Number(
                        await getPriceAtDate("shipment_zone_three", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setShipmentZoneFourPrice(
                    Number(
                        await getPriceAtDate("shipment_zone_four", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );

                setCompleteInstallationLockersPrice(
                    Number(
                        await getPriceAtDate("complete_installation_lockers", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setCompleteAtypicalPrice(
                    Number(
                        await getPriceAtDate("complete_atypical", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );

                setBasicLockersPrice(
                    Number(
                        await getPriceAtDate("basic_lockers", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setBasicMilledPrice(
                    Number(
                        await getPriceAtDate("basic_milled", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setBasicAtypicalPrice(
                    Number(
                        await getPriceAtDate("basic_atypical", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );

                setInstallationDigesterPrice(
                    Number(
                        await getPriceAtDate("installation_digester", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationHobPrice(
                    Number(
                        await getPriceAtDate("installation_hob", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationGasHobPrice(
                    Number(
                        await getPriceAtDate("installation_gas_hob", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationLightsPrice(
                    Number(
                        await getPriceAtDate("installation_lights", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationMicrowavePrice(
                    Number(
                        await getPriceAtDate("installation_microwave", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationFreezerPrice(
                    Number(
                        await getPriceAtDate("installation_freezer", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationDishwasherPrice(
                    Number(
                        await getPriceAtDate("installation_dishwasher", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationOvenPrice(
                    Number(
                        await getPriceAtDate("installation_oven", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationFaucetPrice(
                    Number(
                        await getPriceAtDate("installation_sink", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationMilledJointPrice(
                    Number(
                        await getPriceAtDate("installation_milled_joint", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationWorktopPrice(
                    Number(
                        await getPriceAtDate("installation_worktop", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setInstallationWallPanelPrice(
                    Number(
                        await getPriceAtDate("installation_wall_panel", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );

                setApplianceOutsideOfIkeaPrice(
                    Number(
                        await getPriceAtDate("appliance_outside_of_ikea", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
                setGasApplianceOutsideOfIkeaPrice(
                    Number(
                        await getPriceAtDate("gas_appliance_outside_of_ikea", referenceDate).then(
                            (price) => price?.price
                        )
                    )
                );
            } else {
                toast.error("Žádné referenční datum");
            }
        };
        fetchPrice();
    }, [referenceDate, userRole]);

    const calculateShipmentZoneTotal = (
        price: number | undefined,
        quantity: string | undefined
    ): number => {
        return (Number(price) || 0) * (Number(quantity) || 0);
    };

    const shipmentPrice =
        calculateShipmentZoneTotal(shipmentZoneOnePrice, form.getValues().shipmentZoneOne) +
        calculateShipmentZoneTotal(shipmentZoneTwoPrice, form.getValues().shipmentZoneTwo) +
        calculateShipmentZoneTotal(shipmentZoneThreePrice, form.getValues().shipmentZoneThree) +
        calculateShipmentZoneTotal(shipmentZoneFourPrice, form.getValues().shipmentZoneFour);

    const completeInstallationPrice =
        calculateShipmentZoneTotal(
            completeInstallationLockersPrice,
            form.getValues().completeInstallationLockers
        ) + calculateShipmentZoneTotal(completeAtypicalPrice, form.getValues().completeAtypical);

    const basicInstallationPrice =
        calculateShipmentZoneTotal(basicLockersPrice, form.getValues().basicLockers) +
        calculateShipmentZoneTotal(basicMilledPrice, form.getValues().basicMilled) +
        calculateShipmentZoneTotal(basicAtypicalPrice, form.getValues().basicAtypical);

    const installationPrice =
        calculateShipmentZoneTotal(
            installationDigesterPrice,
            form.getValues().installationDigester
        ) +
        calculateShipmentZoneTotal(installationHobPrice, form.getValues().installationHob) +
        calculateShipmentZoneTotal(installationGasHobPrice, form.getValues().installationGasHob) +
        calculateShipmentZoneTotal(installationLightsPrice, form.getValues().installationLights) +
        calculateShipmentZoneTotal(
            installationMicrowavePrice,
            form.getValues().installationMicrowave
        ) +
        calculateShipmentZoneTotal(installationFreezerPrice, form.getValues().installationFreezer) +
        calculateShipmentZoneTotal(
            installationDishwasherPrice,
            form.getValues().installationDishwasher
        ) +
        calculateShipmentZoneTotal(installationOvenPrice, form.getValues().installationOven) +
        calculateShipmentZoneTotal(installationFaucetPrice, form.getValues().installationFaucet) +
        calculateShipmentZoneTotal(
            installationMilledJointPrice,
            form.getValues().installationMilledJoint
        ) +
        calculateShipmentZoneTotal(installationWorktopPrice, form.getValues().installationWorktop) +
        calculateShipmentZoneTotal(
            installationWallPanelPrice,
            form.getValues().installationWallPanel
        ) +
        calculateShipmentZoneTotal(
            applianceOutsideOfIkeaPrice,
            form.getValues().applianceOutsideOfIkea
        ) +
        calculateShipmentZoneTotal(
            gasApplianceOutsideOfIkeaPrice,
            form.getValues().gasApplianceOutsideOfIkea
        );

    const calculateTotalPrice = () => {
        const prices = [
            shipmentPrice,
            completeInstallationPrice,
            basicInstallationPrice,
            installationPrice
        ];

        const total = prices.reduce((acc, price) => acc + (price ?? 0), 0);

        const taxRate = form.getValues().tax ? 1.12 : 1.21;
        const bail = Number(form.getValues().bail ?? 0);

        return total * taxRate - bail;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-12"
                >
                    <div className="flex items-baseline justify-between gap-x-8">
                        <Typography variant="h2">Doprava montérů</Typography>
                        <Unit
                            value={String(shipmentPrice)}
                            className="text-xl font-medium tracking-wider text-foreground"
                            unit=",-"
                        />
                    </div>

                    <Separator className="!mt-0" />

                    <div className="grid gap-8 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="shipmentZoneOne"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-baseline gap-x-2">
                                        <FormLabel>Zóna 1</FormLabel>
                                        <Unit
                                            value={shipmentZoneOnePrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Zóna 2</FormLabel>
                                        <Unit
                                            value={shipmentZoneTwoPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Zóna 3</FormLabel>
                                        <Unit
                                            value={shipmentZoneThreePrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Zóna 4</FormLabel>
                                        <Unit
                                            value={shipmentZoneFourPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-baseline justify-between gap-x-8">
                        <Typography variant="h2">Kompletní instalace Method</Typography>
                        <Unit
                            value={String(completeInstallationPrice)}
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
                                        <FormLabel>Montáž skříněk</FormLabel>
                                        <Unit
                                            value={
                                                completeInstallationLockersPrice ??
                                                "NCena nenalezena"
                                            }
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Atypické práce nad 2h</FormLabel>
                                        <Unit
                                            value={completeAtypicalPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-baseline justify-between gap-x-8">
                        <Typography variant="h2">Základní instalace Method</Typography>
                        <Unit
                            value={String(basicInstallationPrice)}
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
                                        <FormLabel>Montáž skříněk</FormLabel>
                                        <Unit
                                            value={basicLockersPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Frézovaný spoj</FormLabel>
                                        <Unit
                                            value={basicMilledPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Atypické práce nad 2h</FormLabel>
                                        <Unit
                                            value={basicAtypicalPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-baseline justify-between gap-x-8">
                        <Typography variant="h2">Instalace</Typography>
                        <Unit
                            value={String(installationPrice)}
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
                                        <FormLabel>Digestoř</FormLabel>
                                        <Unit
                                            value={installationDigesterPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Varná deska</FormLabel>
                                        <Unit
                                            value={installationHobPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Varná deska plyn</FormLabel>
                                        <Unit
                                            value={installationGasHobPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Světla</FormLabel>
                                        <Unit
                                            value={installationLightsPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Mikrovlnná trouba</FormLabel>
                                        <Unit
                                            value={installationMicrowavePrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Chladnička / Mrazák</FormLabel>
                                        <Unit
                                            value={installationFreezerPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Myčka</FormLabel>
                                        <Unit
                                            value={
                                                installationDishwasherPrice ?? "NCena nenalezena"
                                            }
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Trouba</FormLabel>
                                        <Unit
                                            value={installationOvenPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Baterie a dřez</FormLabel>
                                        <Unit
                                            value={installationFaucetPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Frézovaný spoj</FormLabel>
                                        <Unit
                                            value={
                                                installationMilledJointPrice ?? "NCena nenalezena"
                                            }
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Pracovní deska </FormLabel>
                                        <Unit
                                            value={installationWorktopPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Nástěnný panel </FormLabel>
                                        <Unit
                                            value={installationWallPanelPrice ?? "NCena nenalezena"}
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
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
                                        <FormLabel>Spotřebič mimo IKEA</FormLabel>
                                        <Unit
                                            value={
                                                applianceOutsideOfIkeaPrice ?? "NCena nenalezena"
                                            }
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gasApplianceOutsideOfIkea"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-baseline gap-x-2">
                                        <FormLabel>Plyn. Spotř. Mimo IKEA </FormLabel>
                                        <Unit
                                            value={
                                                gasApplianceOutsideOfIkeaPrice ?? "NCena nenalezena"
                                            }
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
                                            className={cn(
                                                field.value == "0.00" ? "text-muted-foreground" : ""
                                            )}
                                            disabled={!userRole && archived}
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-baseline justify-between gap-x-8">
                        <Typography variant="h2">Kauce</Typography>
                        <Unit
                            value={
                                Math.floor(
                                    Number(form.getValues().bail ?? 0) *
                                        Number(form.getValues().tax ? 1.12 : 1.21) *
                                        100
                                ) / 100
                            }
                            className="text-xl font-medium tracking-wider text-foreground"
                            unit=",-"
                        />
                    </div>

                    <Separator className="!mt-0 mb-8" />

                    <div className="grid gap-8 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="bail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kauce</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            step=".01"
                                            onFocus={(event) => event.currentTarget.select()}
                                            disabled={!userRole && archived}
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
                                    <FormLabel>Daň</FormLabel>

                                    <FormControl className="print:hidden">
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
                                                disabled={!userRole && archived}
                                            />
                                            <Typography
                                                variant="muted"
                                                as="p"
                                            >
                                                12%
                                            </Typography>
                                        </div>
                                    </FormControl>
                                    <Typography className="hidden text-black print:block">
                                        {field.value ? "12%" : "21%"}
                                    </Typography>
                                    <FormDescription className="print:hidden">
                                        Ať je daň 12 % místo 21 %
                                    </FormDescription>

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
                                <FormLabel>Podpis</FormLabel>

                                <div className="relative w-fit max-sm:w-full">
                                    <FormControl>
                                        {/* TODO: on change should submit*/}
                                        <SignatureCanvas
                                            ref={sigCanvasRef}
                                            canvasProps={{
                                                className:
                                                    "h-40 bg-muted rounded-lg w-full sm:w-92 mt-2"
                                            }}
                                            penColor={!userRole && archived ? "#00000000" : "#000"}
                                            clearOnResize={false}
                                            onEnd={handleSignatureEnd}
                                        />
                                    </FormControl>

                                    <Button
                                        type="button"
                                        size={"icon"}
                                        onClick={handleClearSignature}
                                        variant={"secondary"}
                                        className="absolute -bottom-2 -right-2 print:hidden"
                                        disabled={!userRole && archived}
                                    >
                                        <Eraser className="size-4" />
                                    </Button>
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator />

                    <Typography
                        as="h3"
                        asChild
                    >
                        <Unit
                            value={calculateTotalPrice().toFixed(2)}
                            unit=",-"
                            variant="h1"
                            as="p"
                            className="pt-12 text-right text-primary"
                        />
                    </Typography>
                </form>
            </Form>
        </motion.div>
    );
}

export default PCK;
