"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import { toast } from "sonner";
import { z } from "zod";

import { getAdminPriceAtDate, getPriceAtDate, updateOrderList1 } from "@/db/db";

import { Typography } from "@/components/ui/Typography";
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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

import { TOrderListOne, TOrderPP2Specifications } from "@/types/dbSchemas";
import { formList1Schema } from "@/types/orderForm";

type TList1Props = {
    orderList1: TOrderListOne;
    userRole: boolean;
    referenceDate: Date | undefined;
    PP2Specifications: TOrderPP2Specifications;
    archived: boolean;
};

function List1({ orderList1, userRole, referenceDate, PP2Specifications, archived }: TList1Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [prices, setPrices] = useState({
        credit: 0,
        aboveFifty: 0,
        highLocker: 0,
        lowerLocker: 0,
        upperLocker: 0,
        milledJoint: 0,
        tailoredWorktop: 0,
        worktop: 0,
        wallPanel: 0,
        atypical: 0,
        unnecessary: 0,
        kitchen: 0,
        lights: 0,
        ikea: 0,
        ikeaGas: 0,
        nonIkea: 0,
        nonIkeaGas: 0
    });

    const [adminPrices, setAdminPrices] = useState({
        credit: 0,
        aboveFifty: 0,
        highLocker: 0,
        lowerLocker: 0,
        upperLocker: 0,
        milledJoint: 0,
        tailoredWorktop: 0,
        worktop: 0,
        wallPanel: 0,
        atypical: 0,
        unnecessary: 0,
        kitchen: 0,
        lights: 0,
        ikea: 0,
        ikeaGas: 0,
        nonIkea: 0,
        nonIkeaGas: 0
    });

    const form = useForm<z.infer<typeof formList1Schema>>({
        resolver: zodResolver(formList1Schema),
        defaultValues: {
            aboveFifty: String(orderList1.aboveFifty),
            credit: String(orderList1.credit),

            material: String(orderList1.material)
        }
    });

    const onSubmit = useCallback(
        (values: z.infer<typeof formList1Schema>) => {
            try {
                const updatedOrder: TOrderListOne = {
                    aboveFifty: String(values.aboveFifty === "null" ? 0 : values.aboveFifty),
                    credit: String(values.credit === "null" ? 0 : values.credit),

                    material: String(values.material === "null" ? 0 : values.material)
                };

                const promise = updateOrderList1(orderList1.id as string, updatedOrder, userRole);

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
        [userRole, orderList1.id]
    );

    const fetchPrices = useCallback(async () => {
        if (!referenceDate) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const pricePromises = [
                "credit",
                "aboveFifty",
                "high_locker",
                "lower_locker",
                "upper_locker",
                "milled_joint",
                "tailored_worktop",
                "worktop",
                "wall_panel",
                "atypical",
                "unnecessary",
                "kitchen",
                "lights",
                "ikea",
                "ikea_gas",
                "non_ikea",
                "non_ikea_gas"
            ].map((key) => getPriceAtDate(key, referenceDate));

            const results = await Promise.all(pricePromises);

            const newPrices = {
                credit: Number(results[0]?.price ?? 0),
                aboveFifty: Number(results[1]?.price ?? 0),
                highLocker: Number(results[2]?.price ?? 0),
                lowerLocker: Number(results[3]?.price ?? 0),
                upperLocker: Number(results[4]?.price ?? 0),
                milledJoint: Number(results[5]?.price ?? 0),
                tailoredWorktop: Number(results[6]?.price ?? 0),
                worktop: Number(results[7]?.price ?? 0),
                wallPanel: Number(results[8]?.price ?? 0),
                atypical: Number(results[9]?.price ?? 0),
                unnecessary: Number(results[10]?.price ?? 0),
                kitchen: Number(results[11]?.price ?? 0),
                lights: Number(results[12]?.price ?? 0),
                ikea: Number(results[13]?.price ?? 0),
                ikeaGas: Number(results[14]?.price ?? 0),
                nonIkea: Number(results[15]?.price ?? 0),
                nonIkeaGas: Number(results[16]?.price ?? 0)
            };

            setPrices(newPrices);

            // Only fetch admin prices if user is admin
            if (userRole) {
                const adminPricePromises = [
                    "credit",
                    "aboveFifty",
                    "high_locker",
                    "lower_locker",
                    "upper_locker",
                    "milled_joint",
                    "tailored_worktop",
                    "worktop",
                    "wall_panel",
                    "atypical",
                    "unnecessary",
                    "kitchen",
                    "lights",
                    "ikea",
                    "ikea_gas",
                    "non_ikea",
                    "non_ikea_gas"
                ].map((key) => getAdminPriceAtDate(key, referenceDate));

                const adminResults = await Promise.all(adminPricePromises);

                const newAdminPrices = {
                    credit: Number(adminResults[0]?.price ?? 0),
                    aboveFifty: Number(adminResults[1]?.price ?? 0),
                    highLocker: Number(adminResults[2]?.price ?? 0),
                    lowerLocker: Number(adminResults[3]?.price ?? 0),
                    upperLocker: Number(adminResults[4]?.price ?? 0),
                    milledJoint: Number(adminResults[5]?.price ?? 0),
                    tailoredWorktop: Number(adminResults[6]?.price ?? 0),
                    worktop: Number(adminResults[7]?.price ?? 0),
                    wallPanel: Number(adminResults[8]?.price ?? 0),
                    atypical: Number(adminResults[9]?.price ?? 0),
                    unnecessary: Number(adminResults[10]?.price ?? 0),
                    kitchen: Number(adminResults[11]?.price ?? 0),
                    lights: Number(adminResults[12]?.price ?? 0),
                    ikea: Number(adminResults[13]?.price ?? 0),
                    ikeaGas: Number(adminResults[14]?.price ?? 0),
                    nonIkea: Number(adminResults[15]?.price ?? 0),
                    nonIkeaGas: Number(adminResults[16]?.price ?? 0)
                };

                setAdminPrices(newAdminPrices);
            }
        } catch (error) {
            console.error("Error fetching prices:", error);
            toast.error("Chyba při načítání cen");
        } finally {
            setIsLoading(false);
        }
    }, [referenceDate, userRole]);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    const debouncedSubmit = useCallback(
        (values: z.infer<typeof formList1Schema>) => {
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

    const creditValue = form.watch("credit");
    const aboveFiftyValue = form.watch("aboveFifty");

    const totalPrice = useMemo(() => {
        const total =
            prices.credit * Number(creditValue) +
            prices.aboveFifty * Number(aboveFiftyValue) +
            prices.highLocker * Number(PP2Specifications.highLocker ?? 0) +
            prices.lowerLocker * Number(PP2Specifications.lowerLocker ?? 0) +
            prices.upperLocker * Number(PP2Specifications.upperLocker ?? 0) +
            prices.milledJoint * Number(PP2Specifications.milledJoint ?? 0) +
            prices.worktop * Number(PP2Specifications.worktop ?? 0) +
            prices.wallPanel * Number(PP2Specifications.wallPanel ?? 0) +
            prices.atypical * Number(PP2Specifications.atypical ?? 0) +
            prices.unnecessary * Number(PP2Specifications.unnecessary ?? 0) +
            prices.kitchen * Number(PP2Specifications.kitchen ?? 0) +
            prices.lights * Number(PP2Specifications.lights ?? 0) +
            prices.ikea * Number(PP2Specifications.ikea ?? 0) +
            prices.ikeaGas * Number(PP2Specifications.ikeaGas ?? 0) +
            prices.nonIkea * Number(PP2Specifications.nonIkea ?? 0) +
            prices.nonIkeaGas * Number(PP2Specifications.nonIkeaGas ?? 0);

        return total;
    }, [prices, creditValue, aboveFiftyValue, PP2Specifications]);

    const totalAdminPrice = useMemo(() => {
        const total =
            adminPrices.credit * Number(creditValue) +
            adminPrices.aboveFifty * Number(aboveFiftyValue) +
            adminPrices.highLocker * Number(PP2Specifications.highLocker ?? 0) +
            adminPrices.lowerLocker * Number(PP2Specifications.lowerLocker ?? 0) +
            adminPrices.upperLocker * Number(PP2Specifications.upperLocker ?? 0) +
            adminPrices.milledJoint * Number(PP2Specifications.milledJoint ?? 0) +
            adminPrices.worktop * Number(PP2Specifications.worktop ?? 0) +
            adminPrices.wallPanel * Number(PP2Specifications.wallPanel ?? 0) +
            adminPrices.atypical * Number(PP2Specifications.atypical ?? 0) +
            adminPrices.unnecessary * Number(PP2Specifications.unnecessary ?? 0) +
            adminPrices.kitchen * Number(PP2Specifications.kitchen ?? 0) +
            adminPrices.lights * Number(PP2Specifications.lights ?? 0) +
            adminPrices.ikea * Number(PP2Specifications.ikea ?? 0) +
            adminPrices.ikeaGas * Number(PP2Specifications.ikeaGas ?? 0) +
            adminPrices.nonIkea * Number(PP2Specifications.nonIkea ?? 0) +
            adminPrices.nonIkeaGas * Number(PP2Specifications.nonIkeaGas ?? 0);

        return total;
    }, [adminPrices, creditValue, aboveFiftyValue, PP2Specifications]);

    if (isLoading) {
        return (
            <Typography
                variant="h2"
                as="p"
                className="mx-auto my-6 w-fit"
            >
                Načítání cen...
            </Typography>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Table>
                    <TableCaption></TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Služba</TableHead>
                            <TableHead className="w-[100px]">Počet</TableHead>
                            <TableHead>Cena</TableHead>
                            <TableHead>Zisk</TableHead>
                            {userRole && (
                                <>
                                    <TableHead className="text-right">Unitech Cena</TableHead>
                                    <TableHead className="text-right">Unitech Zisk</TableHead>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Paušál (do 50 km)</TableCell>

                            <TableCell className="font-medium">
                                <Typography
                                    as="span"
                                    className="hidden print:block"
                                >
                                    {form.getValues().credit}
                                </Typography>
                                <FormField
                                    control={form.control}
                                    name="credit"
                                    render={({ field }) => (
                                        <FormItem className="print:hidden">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step=".01"
                                                    onFocus={(event) =>
                                                        event.currentTarget.select()
                                                    }
                                                    className={cn(
                                                        field.value == "0.00" ?
                                                            "text-muted-foreground"
                                                        :   ""
                                                    )}
                                                    disabled={!userRole && archived}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>{prices.credit},-</TableCell>
                            <TableCell>
                                {prices.credit * Number(form.getValues().credit)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.credit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.credit * Number(form.getValues().credit)},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Nad 50km + 18,-Kč/km</TableCell>

                            <TableCell className="font-medium">
                                <Typography
                                    as="span"
                                    className="hidden print:block"
                                >
                                    {form.getValues().aboveFifty}
                                </Typography>
                                <FormField
                                    control={form.control}
                                    name="aboveFifty"
                                    render={({ field }) => (
                                        <FormItem className="print:hidden">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step=".01"
                                                    onFocus={(event) =>
                                                        event.currentTarget.select()
                                                    }
                                                    className={cn(
                                                        field.value == "0.00" ?
                                                            "text-muted-foreground"
                                                        :   ""
                                                    )}
                                                    disabled={!userRole && archived}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>{prices.aboveFifty},-</TableCell>
                            <TableCell>
                                {prices.aboveFifty * Number(form.getValues().aboveFifty)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.aboveFifty}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.aboveFifty *
                                            Number(form.getValues().aboveFifty)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Montáž spodních skříněk</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.lowerLocker ?? 0}
                            </TableCell>
                            <TableCell>{prices.lowerLocker},-</TableCell>
                            <TableCell>
                                {prices.lowerLocker * Number(PP2Specifications.lowerLocker)}
                                ,-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.lowerLocker}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.lowerLocker *
                                            Number(PP2Specifications.lowerLocker)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Montáž horních skříněk</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.upperLocker ?? 0}
                            </TableCell>
                            <TableCell>{prices.upperLocker},-</TableCell>
                            <TableCell>
                                {prices.upperLocker * Number(PP2Specifications.upperLocker)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.upperLocker}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.upperLocker *
                                            Number(PP2Specifications.upperLocker)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Montáž vysokých skříněk</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.highLocker ?? 0}
                            </TableCell>
                            <TableCell>{prices.highLocker},-</TableCell>
                            <TableCell>
                                {prices.highLocker * Number(PP2Specifications.highLocker)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.highLocker}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.highLocker *
                                            Number(PP2Specifications.highLocker)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Frézovaný spoj</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.milledJoint ?? 0}
                            </TableCell>
                            <TableCell>{prices.milledJoint},-</TableCell>
                            <TableCell>
                                {prices.milledJoint * Number(PP2Specifications.milledJoint)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.milledJoint}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.milledJoint *
                                            Number(PP2Specifications.milledJoint)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Pracovní desky</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.worktop ?? 0}
                            </TableCell>
                            <TableCell>{prices.worktop},-</TableCell>
                            <TableCell>
                                {prices.worktop * Number(PP2Specifications.worktop)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.worktop}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.worktop * Number(PP2Specifications.worktop)},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Nástěnné panely</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.wallPanel ?? 0}
                            </TableCell>
                            <TableCell>{prices.wallPanel},-</TableCell>
                            <TableCell>
                                {prices.wallPanel * Number(PP2Specifications.wallPanel)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.wallPanel}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.wallPanel *
                                            Number(PP2Specifications.wallPanel)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Atypické práce</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.atypical ?? 0}
                            </TableCell>
                            <TableCell>{prices.atypical},-</TableCell>
                            <TableCell>
                                {prices.atypical * Number(PP2Specifications.atypical)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.atypical}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.atypical * Number(PP2Specifications.atypical)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Marný výjezd</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.unnecessary ?? 0}
                            </TableCell>
                            <TableCell>{prices.unnecessary},-</TableCell>
                            <TableCell>
                                {prices.unnecessary * Number(PP2Specifications.unnecessary)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.unnecessary}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.unnecessary *
                                            Number(PP2Specifications.unnecessary)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Zaměření PD/kuchyně</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.kitchen ?? 0}
                            </TableCell>
                            <TableCell>{prices.kitchen},-</TableCell>
                            <TableCell>
                                {prices.kitchen * Number(PP2Specifications.kitchen)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.kitchen}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.kitchen * Number(PP2Specifications.kitchen)},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Materiál</TableCell>

                            <TableCell>
                                <Typography
                                    as="span"
                                    className="hidden print:block"
                                >
                                    {form.getValues().material}
                                </Typography>
                                <FormField
                                    control={form.control}
                                    name="material"
                                    render={({ field }) => (
                                        <FormItem className="print:hidden">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step=".01"
                                                    onFocus={(event) =>
                                                        event.currentTarget.select()
                                                    }
                                                    className={cn(
                                                        field.value == "0.00" ?
                                                            "text-muted-foreground"
                                                        :   ""
                                                    )}
                                                    disabled={!userRole && archived}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Světla</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.lights ?? 0}
                            </TableCell>
                            <TableCell>{prices.lights},-</TableCell>
                            <TableCell>
                                {prices.lights * Number(PP2Specifications.lights)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.lights}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.lights * Number(PP2Specifications.lights)},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Spotřebič IKEA</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.ikea ?? 0}
                            </TableCell>
                            <TableCell>{prices.ikea},-</TableCell>
                            <TableCell>{prices.ikea * Number(PP2Specifications.ikea)},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminPrices.ikea}</TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.ikea * Number(PP2Specifications.ikea)},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Spotřebič mimo IKEA</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.nonIkea ?? 0}
                            </TableCell>
                            <TableCell>{prices.nonIkea},-</TableCell>
                            <TableCell>
                                {prices.nonIkea * Number(PP2Specifications.nonIkea)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.nonIkea}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.nonIkea * Number(PP2Specifications.nonIkea)},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Spotřebič IKEA plyn</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.ikeaGas ?? 0}
                            </TableCell>
                            <TableCell>{prices.ikeaGas},-</TableCell>
                            <TableCell>
                                {prices.ikeaGas * Number(PP2Specifications.ikeaGas)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.ikeaGas}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.ikeaGas * Number(PP2Specifications.ikeaGas)},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Spotřebič mimo IKEA plyn</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.nonIkeaGas ?? 0}
                            </TableCell>
                            <TableCell>{prices.nonIkeaGas},-</TableCell>
                            <TableCell>
                                {prices.nonIkeaGas * Number(PP2Specifications.nonIkeaGas)},-
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">
                                        {adminPrices.nonIkeaGas}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {adminPrices.nonIkeaGas *
                                            Number(PP2Specifications.nonIkeaGas)}
                                        ,-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell />
                            <TableCell />
                            <TableCell />
                            <TableCell>
                                <Typography
                                    variant="h3"
                                    as="p"
                                >
                                    {totalPrice} ,-
                                </Typography>
                            </TableCell>
                            {userRole && (
                                <>
                                    <TableCell />
                                    <TableCell className="text-right">
                                        <Typography
                                            variant="h3"
                                            as="p"
                                        >
                                            {totalAdminPrice} ,-
                                        </Typography>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    </TableBody>
                </Table>
            </form>
        </Form>
    );
}

export default List1;
