"use client";

import { useCallback, useEffect, useState } from "react";
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
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
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
    const [credit, setCredit] = useState<number | null>(0);
    const [aboveFifty, setAboveFifty] = useState<number | null>(0);

    const [highLocker, setHighLocker] = useState<number | null>(0);
    const [lowerLocker, setLowerLocker] = useState<number | null>(0);
    const [upperLocker, setUpperLocker] = useState<number | null>(0);
    const [milledJoint, setMilledJoint] = useState<number | null>(0);
    const [tailoredWorktop, setTailoredWorktop] = useState<number | null>(0);
    const [worktop, setWorktop] = useState<number | null>(0);
    const [wallPanel, setWallPanel] = useState<number | null>(0);
    const [atypical, setAtypical] = useState<number | null>(0);
    const [unnecessary, setUnnecessary] = useState<number | null>(0);
    const [kitchen, setKitchen] = useState<number | null>(0);
    const [lights, setLights] = useState<number | null>(0);
    const [ikea, setIkea] = useState<number | null>(0);
    const [ikeaGas, setIkeaGas] = useState<number | null>(0);
    const [nonIkea, setNonIkea] = useState<number | null>(0);
    const [nonIkeaGas, setNonIkeaGas] = useState<number | null>(0);

    const [adminCredit, setAdminCredit] = useState<number | null>(0);
    const [adminAboveFifty, setAdminAboveFifty] = useState<number | null>(0);

    const [adminHighLocker, setAdminHighLocker] = useState<number | null>(0);
    const [adminLowerLocker, setAdminLowerLocker] = useState<number | null>(0);
    const [adminUpperLocker, setAdminUpperLocker] = useState<number | null>(0);
    const [adminMilledJoint, setAdminMilledJoint] = useState<number | null>(0);
    const [adminTailoredWorktop, setAdminTailoredWorktop] = useState<number | null>(0);
    const [adminWorktop, setAdminWorktop] = useState<number | null>(0);
    const [adminWallPanel, setAdminWallPanel] = useState<number | null>(0);
    const [adminAtypical, setAdminAtypical] = useState<number | null>(0);
    const [adminUnnecessary, setAdminUnnecessary] = useState<number | null>(0);
    const [adminKitchen, setAdminKitchen] = useState<number | null>(0);
    const [adminLights, setAdminLights] = useState<number | null>(0);
    const [adminIkea, setAdminIkea] = useState<number | null>(0);
    const [adminIkeaGas, setAdminIkeaGas] = useState<number | null>(0);
    const [adminNonIkea, setAdminNonIkea] = useState<number | null>(0);
    const [adminNonIkeaGas, setAdminNonIkeaGas] = useState<number | null>(0);

    const form = useForm<z.infer<typeof formList1Schema>>({
        resolver: zodResolver(formList1Schema),
        defaultValues: {
            aboveFifty: String(orderList1.aboveFifty),
            credit: String(orderList1.credit),

            material: String(orderList1.material),
        },
    });

    const onSubmit = useCallback(
        (values: z.infer<typeof formList1Schema>) => {
            try {
                const updatedOrder: TOrderListOne = {
                    aboveFifty: String(values.aboveFifty === "null" ? 0 : values.aboveFifty),
                    credit: String(values.credit === "null" ? 0 : values.credit),

                    material: String(values.material === "null" ? 0 : values.material),
                };

                const promise = updateOrderList1(orderList1.id as string, updatedOrder, userRole);

                toast.promise(promise, {
                    loading: "Aktualizování objednávky...",
                    success: () => {
                        return "Objednávka aktualizována úspěšně";
                    },
                    error: () => {
                        return "Něco se pokazilo";
                    },
                });
            } catch {
                return toast.error("Něco se pokazilo", {
                    description: "Prosím počkejte nebo to zkuste znovu",
                });
            }
        },
        [userRole, orderList1.id],
    );

    useEffect(() => {
        const fetchPrice = async () => {
            if (referenceDate) {
                setCredit(
                    Number(
                        await getPriceAtDate("credit", referenceDate).then((price) => price?.price),
                    ),
                );

                setAboveFifty(
                    Number(
                        await getPriceAtDate("aboveFifty", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setHighLocker(
                    Number(
                        await getPriceAtDate("high_locker", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setLowerLocker(
                    Number(
                        await getPriceAtDate("lower_locker", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setUpperLocker(
                    Number(
                        await getPriceAtDate("upper_locker", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setMilledJoint(
                    Number(
                        await getPriceAtDate("milled_joint", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setTailoredWorktop(
                    Number(
                        await getPriceAtDate("tailored_worktop", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setWorktop(
                    Number(
                        await getPriceAtDate("worktop", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setWallPanel(
                    Number(
                        await getPriceAtDate("wall_panel", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAtypical(
                    Number(
                        await getPriceAtDate("atypical", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setUnnecessary(
                    Number(
                        await getPriceAtDate("unnecessary", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setKitchen(
                    Number(
                        await getPriceAtDate("kitchen", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setLights(
                    Number(
                        await getPriceAtDate("lights", referenceDate).then((price) => price?.price),
                    ),
                );

                setIkea(
                    Number(
                        await getPriceAtDate("ikea", referenceDate).then((price) => price?.price),
                    ),
                );

                setIkeaGas(
                    Number(
                        await getPriceAtDate("ikea_gas", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setNonIkea(
                    Number(
                        await getPriceAtDate("non_ikea", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setNonIkeaGas(
                    Number(
                        await getPriceAtDate("non_ikea_gas", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
            } else {
                toast.error("Žádné referenční datum");
            }
        };
        fetchPrice();
    }, [referenceDate]);

    useEffect(() => {
        const fetchPrice = async () => {
            if (referenceDate && userRole) {
                setAdminCredit(
                    Number(
                        await getAdminPriceAtDate("credit", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminAboveFifty(
                    Number(
                        await getAdminPriceAtDate("aboveFifty", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
                setAdminHighLocker(
                    Number(
                        await getAdminPriceAtDate("high_locker", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminLowerLocker(
                    Number(
                        await getAdminPriceAtDate("lower_locker", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminUpperLocker(
                    Number(
                        await getAdminPriceAtDate("upper_locker", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminMilledJoint(
                    Number(
                        await getAdminPriceAtDate("milled_joint", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminTailoredWorktop(
                    Number(
                        await getAdminPriceAtDate("tailored_worktop", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminWorktop(
                    Number(
                        await getAdminPriceAtDate("worktop", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminWallPanel(
                    Number(
                        await getAdminPriceAtDate("wall_panel", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminAtypical(
                    Number(
                        await getAdminPriceAtDate("atypical", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminUnnecessary(
                    Number(
                        await getAdminPriceAtDate("unnecessary", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminKitchen(
                    Number(
                        await getAdminPriceAtDate("kitchen", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminLights(
                    Number(
                        await getAdminPriceAtDate("lights", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminIkea(
                    Number(
                        await getAdminPriceAtDate("ikea", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminIkeaGas(
                    Number(
                        await getAdminPriceAtDate("ikea_gas", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminNonIkea(
                    Number(
                        await getAdminPriceAtDate("non_ikea", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );

                setAdminNonIkeaGas(
                    Number(
                        await getAdminPriceAtDate("non_ikea_gas", referenceDate).then(
                            (price) => price?.price,
                        ),
                    ),
                );
            } else {
                toast.error("Žádné referenční datum");
            }
        };
        fetchPrice();
    }, [referenceDate, userRole]);

    const debouncedSubmit = useCallback(
        () =>
            debounce(async () => {
                onSubmit(form.getValues());
            }, 500),
        [form, onSubmit],
    );

    useEffect(() => {
        const subscription = form.watch(async () => {
            if (await form.trigger()) {
                return debouncedSubmit();
            }
        });

        return () => subscription.unsubscribe();
    }, [form, debouncedSubmit]);

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
                                <span className="hidden print:block">
                                    {form.getValues().credit}
                                </span>
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
                                                        :   "",
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
                            <TableCell>{credit},-</TableCell>
                            <TableCell>{credit ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminCredit}</TableCell>
                                    <TableCell className="text-right">
                                        {adminCredit ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Nad 50km + 18,-Kč/km</TableCell>
                            <TableCell className="font-medium">
                                <span className="hidden print:block">
                                    {form.getValues().aboveFifty}
                                </span>
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
                                                        :   "",
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
                            <TableCell>{aboveFifty},-</TableCell>
                            <TableCell>{aboveFifty ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminAboveFifty}</TableCell>
                                    <TableCell className="text-right">
                                        {adminAboveFifty ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Montáž horních skříněk</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.lowerLocker ?? 0}
                            </TableCell>
                            <TableCell>{lowerLocker},-</TableCell>
                            <TableCell>{lowerLocker ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminLowerLocker}</TableCell>
                                    <TableCell className="text-right">
                                        {adminLowerLocker ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Montáž spodních skříněk</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.upperLocker ?? 0}
                            </TableCell>
                            <TableCell>{upperLocker},-</TableCell>
                            <TableCell>{upperLocker ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminUpperLocker}</TableCell>
                                    <TableCell className="text-right">
                                        {adminUpperLocker ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Montáž vysokých skříněk</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.highLocker ?? 0}
                            </TableCell>
                            <TableCell>{highLocker},-</TableCell>
                            <TableCell>{highLocker ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminHighLocker}</TableCell>
                                    <TableCell className="text-right">
                                        {adminHighLocker ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Frézovaný spoj</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.milledJoint ?? 0}
                            </TableCell>
                            <TableCell>{milledJoint},-</TableCell>
                            <TableCell>{milledJoint ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminMilledJoint}</TableCell>
                                    <TableCell className="text-right">
                                        {adminMilledJoint ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Pracovní desky</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.worktop ?? 0}
                            </TableCell>
                            <TableCell>{worktop},-</TableCell>
                            <TableCell>{worktop ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminWorktop}</TableCell>
                                    <TableCell className="text-right">
                                        {adminWorktop ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Nástěnné panely</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.wallPanel ?? 0}
                            </TableCell>
                            <TableCell>{wallPanel},-</TableCell>
                            <TableCell>{wallPanel ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminWallPanel}</TableCell>
                                    <TableCell className="text-right">
                                        {adminWallPanel ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Atypické práce</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.atypical ?? 0}
                            </TableCell>
                            <TableCell>{atypical},-</TableCell>
                            <TableCell>{atypical ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminAtypical}</TableCell>
                                    <TableCell className="text-right">
                                        {adminAtypical ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Marný výjezd</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.unnecessary ?? 0}
                            </TableCell>
                            <TableCell>{unnecessary},-</TableCell>
                            <TableCell>{unnecessary ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminUnnecessary}</TableCell>
                                    <TableCell className="text-right">
                                        {adminUnnecessary ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Zaměření PD/kuchyně</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.kitchen ?? 0}
                            </TableCell>
                            <TableCell>{kitchen},-</TableCell>
                            <TableCell>{kitchen ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminKitchen}</TableCell>
                                    <TableCell className="text-right">
                                        {adminKitchen ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Materiál</TableCell>
                            <span className="hidden print:block">{form.getValues().material}</span>
                            <TableCell>
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
                                                        :   "",
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
                            <TableCell>{lights},-</TableCell>
                            <TableCell>{lights ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminLights}</TableCell>
                                    <TableCell className="text-right">
                                        {adminLights ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Spotřebič IKEA</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.ikea ?? 0}
                            </TableCell>
                            <TableCell>{ikea},-</TableCell>
                            <TableCell>{ikea ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminIkea}</TableCell>
                                    <TableCell className="text-right">
                                        {adminIkea ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Spotřebič mimo IKEA</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.nonIkea ?? 0}
                            </TableCell>
                            <TableCell>{nonIkea},-</TableCell>
                            <TableCell>{nonIkea ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminNonIkea}</TableCell>
                                    <TableCell className="text-right">
                                        {adminNonIkea ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Spotřebič IKEA plyn</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.ikeaGas ?? 0}
                            </TableCell>
                            <TableCell>{ikeaGas},-</TableCell>
                            <TableCell>{ikeaGas ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminIkeaGas}</TableCell>
                                    <TableCell className="text-right">
                                        {adminIkeaGas ?? 0 * 1},-
                                    </TableCell>
                                </>
                            )}
                        </TableRow>

                        <TableRow>
                            <TableCell>Spotřebič mimo IKEA plyn</TableCell>
                            <TableCell className="font-medium">
                                {PP2Specifications.nonIkeaGas ?? 0}
                            </TableCell>
                            <TableCell>{nonIkeaGas},-</TableCell>
                            <TableCell>{nonIkeaGas ?? 0 * 1},-</TableCell>
                            {userRole && (
                                <>
                                    <TableCell className="text-right">{adminNonIkeaGas}</TableCell>
                                    <TableCell className="text-right">
                                        {adminNonIkeaGas ?? 0 * 1},-
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
                                    {(highLocker ?? 0) +
                                        (lowerLocker ?? 0) +
                                        (upperLocker ?? 0) +
                                        (milledJoint ?? 0) +
                                        (tailoredWorktop ?? 0) +
                                        (worktop ?? 0) +
                                        (wallPanel ?? 0) +
                                        (atypical ?? 0) +
                                        (unnecessary ?? 0) +
                                        (kitchen ?? 0) +
                                        (lights ?? 0) +
                                        (ikea ?? 0) +
                                        (ikeaGas ?? 0) +
                                        (nonIkea ?? 0) +
                                        (nonIkeaGas ?? 0)}
                                    ,-
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
                                            {(adminHighLocker ?? 0) +
                                                (adminLowerLocker ?? 0) +
                                                (adminUpperLocker ?? 0) +
                                                (adminMilledJoint ?? 0) +
                                                (adminTailoredWorktop ?? 0) +
                                                (adminWorktop ?? 0) +
                                                (adminWallPanel ?? 0) +
                                                (adminAtypical ?? 0) +
                                                (adminUnnecessary ?? 0) +
                                                (adminKitchen ?? 0) +
                                                (adminLights ?? 0) +
                                                (adminIkea ?? 0) +
                                                (adminIkeaGas ?? 0) +
                                                (adminNonIkea ?? 0) +
                                                (adminNonIkeaGas ?? 0)}
                                            ,-
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
