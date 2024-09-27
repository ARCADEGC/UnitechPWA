"use client";

import { TOrderPP2 } from "@/types/dbSchemas";
import { formPP2Schema } from "@/types/orderForm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignatureCanvas from "react-signature-canvas";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { OrderPP2 } from "@/db/schema";
import { updateOrderPP2 } from "@/db/db";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cubicBezier, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Eraser } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Typography } from "@/components/ui/Typography";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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
            custommerSignature: orderPP2.custommerSignature,
        },
        mode: "all",
    });

    async function onSubmit(values: z.infer<typeof formPP2Schema>) {
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
                    values.tailoredWorktop === "null" ? 0 : values.tailoredWorktop,
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
                date: values.date ?? new Date(),
            };

            const promise = updateOrderPP2(orderPP2.id as string, updatedOrder, userRole);

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

    const debouncedSubmit = useCallback(
        debounce(async () => {
            onSubmit(form.getValues());
        }, 500),
        [orderPP2, userRole],
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
            <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.5,
                    ease: cubicBezier(0.4, 0, 0.2, 1),
                    layout: {
                        duration: 0.1,
                    },
                }}
                layout
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
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Install another service
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
                                        <FormLabel>Time To Finish</FormLabel>

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
                                        />
                                    </FormControl>
                                    <FormLabel className="!mt-0 text-sm font-normal">
                                        Contact with Ikea
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
                                        <FormLabel>Number of Return</FormLabel>

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
                                        Finished
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="no">Impossible</SelectItem>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="canceled">Canceled</SelectItem>
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
                                        <FormLabel>Reason of Impossibility</FormLabel>

                                        <FormControl>
                                            <Textarea {...field} />
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
                                        <FormLabel>Reason of Cancelation</FormLabel>

                                        <FormControl>
                                            <Textarea {...field} />
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Water Connection
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Couplings and Kitchen Adjustment
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Test Dishwasher Faucet
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    View Cuts Ok
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Electrical Appliances Plugged In
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Cleaning of Kitchen and Installation Area
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Electrical Test Appliances
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Previous Damage to Apartment
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Sealing of Worktops
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
                                    />
                                </FormControl>
                                <FormLabel className="!mt-0 text-sm font-normal">
                                    Damage to Flat During Installation
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
                            <FormLabel>Comment</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>

                            <FormDescription>
                                <Typography
                                    variant="muted"
                                    className="print:hidden"
                                >
                                    For custommer review please go{" "}
                                    <Typography
                                        variant="anchor"
                                        asChild
                                    >
                                        <Link href={""}>here</Link>
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
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground",
                                            )}
                                        >
                                            {field.value ?
                                                format(field.value, "PPP")
                                            :   <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                    <Typography variant="h2">Specification</Typography>
                </div>

                <Separator className="!mt-0 mb-8" />

                <div>
                    <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="upperLocker"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Upper Locker</FormLabel>
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
                            name="lowerLocker"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lower Locker</FormLabel>
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
                            name="highLocker"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>High Locker</FormLabel>
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
                            name="milledJoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Milled Joint</FormLabel>
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
                            name="worktop"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Worktop</FormLabel>
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
                            name="tailoredWorktop"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tailored Worktop</FormLabel>
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
                            name="wallPanel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Wall Panel</FormLabel>
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
                            name="atypical"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Atypical</FormLabel>
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
                            name="unnecessary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Unnecessary</FormLabel>
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
                            name="kitchen"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kitchen</FormLabel>
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

                    <Separator className="mb-8 mt-12" />

                    <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="lights"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lights</FormLabel>
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
                            name="ikea"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ikea</FormLabel>
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
                            name="nonIkea"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Non Ikea</FormLabel>
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
                            name="ikeaGas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ikea Gas</FormLabel>
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
                            name="nonIkeaGas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Non Ikea Gas</FormLabel>
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
                </div>

                <Separator className="mb-8 mt-12" />

                <div className="flex justify-between gap-x-8">
                    <FormField
                        control={form.control}
                        name="custommerSignature"
                        render={({ field }) => (
                            <FormItem className="w-fit">
                                <FormLabel>Custommer Signature</FormLabel>

                                <div className="relative w-fit max-sm:w-full">
                                    <FormControl>
                                        {/* TODO: on change should submit*/}
                                        <SignatureCanvas
                                            ref={custommerSigCanvasRef}
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
                                        onClick={() => workerSigCanvasRef.current?.clear()}
                                        variant={"secondary"}
                                        className="absolute -bottom-2 -right-2 print:hidden"
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
                                <FormLabel>Workers Signature</FormLabel>

                                <div className="relative w-fit max-sm:w-full">
                                    <FormControl>
                                        {/* TODO: on change should submit*/}
                                        <SignatureCanvas
                                            ref={workerSigCanvasRef}
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
                                        onClick={() => workerSigCanvasRef.current?.clear()}
                                        variant={"secondary"}
                                        className="absolute -bottom-2 -right-2 print:hidden"
                                    >
                                        <Eraser className="size-4" />
                                    </Button>
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </motion.form>
        </Form>
    );
}

export default PP2;
