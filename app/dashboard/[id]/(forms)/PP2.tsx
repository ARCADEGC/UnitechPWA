"use client";

import { CalendarIcon, Eraser } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { cubicBezier, motion } from "framer-motion";
import { debounce } from "lodash";
import { toast } from "sonner";
import { z } from "zod";

import { updateOrderPP2 } from "@/db/db";

import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Unit } from "@/components/ui/unit";

import { TOrderPP2 } from "@/types/dbSchemas";
import { formPP2Schema } from "@/types/orderForm";

type TPP2Props = {
    orderPP2: TOrderPP2;
    userRole: boolean;
    archived: boolean;
};

function PP2({ orderPP2, userRole, archived }: TPP2Props) {
    let workerSigCanvasRef = useRef<SignatureCanvas>(null);
    let custommerSigCanvasRef = useRef<SignatureCanvas>(null);

    const form = useForm<z.infer<typeof formPP2Schema>>({
        resolver: zodResolver(formPP2Schema),
        defaultValues: {
            anotherService: orderPP2.anotherService ?? false,
            timeToFinish: Number(orderPP2.timeToFinish),
            contactWithIkea: orderPP2.contactWithIkea ?? false,
            numOfReturn: Number(orderPP2.numOfReturn),
            canceled: orderPP2.finished ?? "no",
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
            custommerSignature: orderPP2.custommerSignature
        },
        mode: "all"
    });

    const onSubmit = useCallback(
        (values: z.infer<typeof formPP2Schema>) => {
            try {
                const updatedOrder: TOrderPP2 = {
                    anotherService: values.anotherService,
                    timeToFinish: String(values.timeToFinish ?? 0),
                    contactWithIkea: values.contactWithIkea,
                    numOfReturn: String(values.numOfReturn ?? 0),
                    finished: values.canceled,
                    reasonOfCancelation:
                        values.reasonOfCancelation === "null" ? "" : values.reasonOfCancelation,
                    reasonOfImposibility:
                        values.reasonOfImposibility === "null" ? "" : values.reasonOfImposibility,
                    waterConnection: values.waterConnection,
                    couplingsAndKitchenAdjustment: values.couplingsAndKitchenAdjustment,
                    testDishwasherFaucet: values.testDishwasherFaucet,
                    viewCutsOk: values.viewCutsOk,
                    electricalAppliancesPluggedIn: values.electricalAppliancesPluggedIn,
                    cleaningOfKitchenInstallationArea: values.cleaningOfKitchenInstallationArea,
                    electricalTestAppliances: values.electricalTestAppliances,
                    previousDamageToApartment: values.previousDamageToApartment,
                    sealingOfWorktops: values.sealingOfWorktops,
                    damageToFlatDuringInstallation: values.damageToFlatDuringInstallation,
                    comment: values.comment ?? "",

                    upperLocker: String(values.upperLocker === "null" ? 0 : values.upperLocker),
                    lowerLocker: String(values.lowerLocker === "null" ? 0 : values.lowerLocker),
                    highLocker: String(values.highLocker === "null" ? 0 : values.highLocker),
                    milledJoint: String(values.milledJoint === "null" ? 0 : values.milledJoint),
                    worktop: String(values.worktop === "null" ? 0 : values.worktop),
                    tailoredWorktop: String(
                        values.tailoredWorktop === "null" ? 0 : values.tailoredWorktop
                    ),
                    wallPanel: String(values.wallPanel === "null" ? 0 : values.wallPanel),
                    atypical: String(values.atypical === "null" ? 0 : values.atypical),
                    unnecessary: String(values.unnecessary === "null" ? 0 : values.unnecessary),
                    kitchen: String(values.kitchen === "null" ? 0 : values.kitchen),

                    lights: String(values.lights === "null" ? 0 : values.lights),
                    ikea: String(values.ikea === "null" ? 0 : values.ikea),
                    nonIkea: String(values.nonIkea === "null" ? 0 : values.nonIkea),
                    ikeaGas: String(values.ikeaGas === "null" ? 0 : values.ikeaGas),
                    nonIkeaGas: String(values.nonIkeaGas === "null" ? 0 : values.nonIkeaGas),

                    workerSignature: workerSigCanvasRef.current?.toData() as SignaturePad.Point[][],
                    custommerSignature:
                        custommerSigCanvasRef.current?.toData() as SignaturePad.Point[][],
                    date: values.date ?? new Date()
                };

                const promise = updateOrderPP2(orderPP2.id as string, updatedOrder, userRole);

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
        [userRole, orderPP2.id]
    );

    useEffect(() => {
        form.getValues().workerSignature ?
            workerSigCanvasRef.current?.fromData(
                form.getValues().workerSignature as SignaturePad.Point[][]
            )
        :   workerSigCanvasRef.current?.clear();
    }, [form]);

    useEffect(() => {
        form.getValues().custommerSignature ?
            custommerSigCanvasRef.current?.fromData(
                form.getValues().custommerSignature as SignaturePad.Point[][]
            )
        :   custommerSigCanvasRef.current?.clear();
    }, [form]);

    const debouncedSubmit = useCallback(
        () =>
            debounce(async () => {
                onSubmit(form.getValues());
            }, 500),
        [form, onSubmit]
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
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.5,
                ease: cubicBezier(0.4, 0, 0.2, 1),
                layout: {
                    duration: 0.1
                }
            }}
            layout
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {/*Another service*/}
                    <>
                        <FormField
                            control={form.control}
                            name="anotherService"
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex items-center gap-x-3">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>
                                        <FormLabel className="!mt-0 text-sm font-normal">
                                            Je vyžadována další služba (domontáž)?
                                        </FormLabel>
                                    </FormItem>
                                );
                            }}
                        />

                        {form.getValues().anotherService && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
                            >
                                <FormField
                                    control={form.control}
                                    name="timeToFinish"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Čas potřebný k dokončení</FormLabel>

                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step=".01"
                                                    onFocus={(event) =>
                                                        event.currentTarget.select()
                                                    }
                                                    disabled={!userRole && archived}
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                    </>

                    {/*Contact with Ikea*/}
                    <>
                        <FormField
                            control={form.control}
                            name="contactWithIkea"
                            render={({ field }) => {
                                return (
                                    <FormItem className="flex items-center gap-x-3">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>
                                        <FormLabel className="!mt-0 text-sm font-normal">
                                            Kontakt s IKEA (kurýr popř. reklamace)
                                        </FormLabel>
                                    </FormItem>
                                );
                            }}
                        />

                        {form.getValues().contactWithIkea && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
                            >
                                <FormField
                                    control={form.control}
                                    name="numOfReturn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Číslo reklamace (SAMS)</FormLabel>

                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step=".01"
                                                    onFocus={(event) =>
                                                        event.currentTarget.select()
                                                    }
                                                    disabled={!userRole && archived}
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                    </>

                    {/*Finished*/}
                    <>
                        <FormField
                            control={form.control}
                            name="canceled"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="!mt-0 text-sm font-normal">
                                            Zakázka dokončena
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!userRole && archived}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a verified email to display" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="yes">Ano</SelectItem>
                                                <SelectItem value="no">Nebylo možné</SelectItem>
                                                <SelectItem value="canceled">Zrušeno</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                );
                            }}
                        />

                        {form.getValues().canceled === "no" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
                            >
                                <FormField
                                    control={form.control}
                                    name="reasonOfImposibility"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nebylo možné dokončení</FormLabel>

                                            <FormControl>
                                                <Textarea
                                                    placeholder="důvod"
                                                    disabled={!userRole && archived}
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        )}

                        {form.getValues().canceled === "canceled" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
                            >
                                <FormField
                                    control={form.control}
                                    name="reasonOfCancelation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zakázka zrušena</FormLabel>

                                            <FormControl>
                                                <Textarea
                                                    placeholder="důvod"
                                                    disabled={!userRole && archived}
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                    </>

                    {/*Checkbox Group*/}
                    <div className="grid gap-8 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="waterConnection"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Provedeno připojení vody
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="testDishwasherFaucet"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Zkouška myčky, baterie
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="electricalAppliancesPluggedIn"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    {" "}
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        El. spotřebiče zapojeny
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="electricalTestAppliances"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Zkouška el. spotřebičů
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sealingOfWorktops"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Utěsnění pracovní desky
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="couplingsAndKitchenAdjustment"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Spáry a seřízení kuchyně v pořádku
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="viewCutsOk"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Pohledové řezy OK
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cleaningOfKitchenInstallationArea"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Úklid kuchyně a prostoru montáže
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="previousDamageToApartment"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Předchozí poškození bytu
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="damageToFlatDuringInstallation"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-x-3">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={!userRole && archived}
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Poškození bytu při montáži
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Komentář</FormLabel>
                                <FormControl>
                                    <Textarea
                                        onInput={(e) => {
                                            const textarea = e.target as HTMLTextAreaElement;
                                            textarea.style.height = "auto";
                                            textarea.style.height = textarea.scrollHeight + "px";
                                        }}
                                        placeholder="Napište sem komentář k objednávce"
                                        className="resize-none"
                                        disabled={!userRole && archived}
                                        {...field}
                                    />
                                </FormControl>

                                <FormDescription>
                                    <Typography
                                        variant="muted"
                                        className="print:hidden"
                                    >
                                        Pro recenzi spokojenosti zákazníka klikněte{" "}
                                        <Typography
                                            variant="anchor"
                                            asChild
                                        >
                                            <Link href={""}>zde</Link>
                                        </Typography>
                                        .
                                    </Typography>
                                </FormDescription>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="grid">
                                <FormLabel>Datum </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                disabled={!userRole && archived}
                                            >
                                                {field.value ?
                                                    format(field.value, "PPP")
                                                :   <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-baseline justify-between gap-x-8">
                        <Typography variant="h2">Specifikace služby </Typography>
                    </div>

                    <Separator className="!mt-0 mb-8" />

                    <div>
                        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="upperLocker"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Montáž horních skříněk </FormLabel>
                                            <Unit unit="bm" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lowerLocker"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Montáž spodních skříněk </FormLabel>
                                            <Unit unit="bm" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="highLocker"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Montáž vysokých skříněk </FormLabel>
                                            <Unit unit="bm" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="milledJoint"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Frézovaný spoj </FormLabel>
                                            <Unit unit="ks" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="worktop"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Pracovní desky </FormLabel>
                                            <Unit unit="bm" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tailoredWorktop"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Pracovní desky na míru </FormLabel>
                                            <Unit unit="bm" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="wallPanel"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Nástěnné panely </FormLabel>
                                            <Unit unit="bm" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="atypical"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Atypické práce </FormLabel>
                                            <Unit unit="hod" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="unnecessary"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Marný výjezd </FormLabel>
                                            <Unit unit="obj" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="kitchen"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Zaměření PD/kuchyně </FormLabel>
                                            <Unit unit="obj" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator className="mb-8 mt-12" />

                        <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="lights"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Osvětlění </FormLabel>
                                            <Unit unit="ks" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ikea"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Spotřebič IKEA </FormLabel>
                                            <Unit unit="ks" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nonIkea"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Spotřebič mimo IKEA </FormLabel>
                                            <Unit unit="ks" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ikeaGas"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Spotřebič IKEA plyn </FormLabel>
                                            <Unit unit="ks" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nonIkeaGas"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-baseline gap-x-2">
                                            <FormLabel>Spotřebič mimo IKEA plyn </FormLabel>
                                            <Unit unit="ks" />
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step=".01"
                                                onFocus={(event) => event.currentTarget.select()}
                                                {...field}
                                                disabled={!userRole && archived}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Separator className="mb-8 mt-12" />

                    <div className="flex justify-between gap-x-8">
                        <FormField
                            control={form.control}
                            name="custommerSignature"
                            render={({ field }) => (
                                <FormItem className="w-fit">
                                    <FormLabel>Podpis zákazníka </FormLabel>

                                    <div className="relative w-fit max-sm:w-full">
                                        <FormControl>
                                            {/* TODO: on change should submit*/}
                                            <SignatureCanvas
                                                ref={custommerSigCanvasRef}
                                                canvasProps={{
                                                    className:
                                                        "h-40 bg-muted rounded-lg w-full sm:w-92 mt-2"
                                                }}
                                                penColor={
                                                    !userRole && archived ? "#00000000" : "#000"
                                                }
                                                clearOnResize={false}
                                            />
                                        </FormControl>

                                        <Button
                                            type="button"
                                            size={"icon"}
                                            onClick={() => custommerSigCanvasRef.current?.clear()}
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

                        <FormField
                            control={form.control}
                            name="workerSignature"
                            render={({ field }) => (
                                <FormItem className="w-fit">
                                    <FormLabel>Podpis servisního partnera </FormLabel>

                                    <div className="relative w-fit max-sm:w-full">
                                        <FormControl>
                                            {/* TODO: on change should submit*/}
                                            <SignatureCanvas
                                                ref={workerSigCanvasRef}
                                                canvasProps={{
                                                    className:
                                                        "h-40 bg-muted rounded-lg w-full sm:w-92 mt-2"
                                                }}
                                                penColor={
                                                    !userRole && archived ? "#00000000" : "#000"
                                                }
                                                clearOnResize={false}
                                            />
                                        </FormControl>

                                        <Button
                                            type="button"
                                            size={"icon"}
                                            onClick={() => workerSigCanvasRef.current?.clear()}
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
                    </div>
                </form>
            </Form>
        </motion.div>
    );
}

export default PP2;
