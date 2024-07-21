"use client";

import React, { useRef, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { motion, cubicBezier } from "framer-motion";

import { Eraser, Save } from "lucide-react";

import { getIdByUserName, getUserNameById, getUsers, updateOrder } from "@/db/db";

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
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { DeleteOrderButton } from "@/app/dashboard/[id]/DeteteOrderButton";

import { TOrder, TUser } from "@/types/dbSchemas";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    content: z.object({}),
    secretMessage: z.string(),
    assignee: z.string(),
});

type TOrderFormProps = {
    order: TOrder;
    userRole: boolean;
};

const OrderForm = ({ order, userRole }: TOrderFormProps) => {
    const [users, setUsers] = useState<TUser[]>([]);

    let sigCanvasRef = useRef<SignatureCanvas>(null);
    const router = useRouter();

    useEffect(() => {
        order?.signature ?
            sigCanvasRef.current?.fromData(order.signature as SignaturePad.Point[][])
        :   sigCanvasRef.current?.clear();
    }, [order]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: order?.name ?? "",
            content: order?.content ?? {},
            secretMessage: order?.secretMessage ?? "",
        },
    });

    useEffect(() => {
        order?.signature ?
            sigCanvasRef.current?.fromData(order.signature as SignaturePad.Point[][])
        :   sigCanvasRef.current?.clear();
    }, [order]);

    useEffect(() => {
        const getAssignee = async () => {
            const assignedUser = (await getUserNameById(order.assignee)) ?? "";
            form.setValue("assignee", assignedUser);
        };

        getAssignee();
    }, [order.assignee]);

    useEffect(() => {
        const fetchUsers = async () => {
            const userList = await getUsers();
            setUsers(userList);
        };

        fetchUsers();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const promise = updateOrder(
                {
                    ...values,
                    id: order?.id,
                    signature: sigCanvasRef.current?.toData(),
                    assignee: (await getIdByUserName(values.assignee)) ?? "",
                },
                userRole,
            )
                .then(() => router.refresh())
                .finally(() =>
                    setTimeout(() => {
                        toast.promise(promise, {
                            loading: "Updating order...",
                            success: () => {
                                return "Order updated successfully";
                            },
                        });
                    }, 300),
                );
        } catch {
            return toast.error("Something went wrong", {
                description: "Please wait or try again",
            });
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mx-auto max-w-prose space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="order name"
                                        autoComplete="on"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {userRole && (
                        <FormField
                            control={form.control}
                            name="secretMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Secret</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="secret message"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Only users with enhanced priveleges can see this message.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <div className="relative w-fit max-sm:w-full">
                        <Label>Signature</Label>

                        <SignatureCanvas
                            ref={sigCanvasRef}
                            canvasProps={{
                                className: "h-40 bg-muted rounded-lg w-full sm:w-92 mt-2",
                            }}
                            penColor="#000"
                            clearOnResize={false}
                        />

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

                    <FormField
                        control={form.control}
                        name="assignee"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assignee</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={form.watch("assignee")}
                                    disabled={!userRole}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a assignee" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.name}
                                            >
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex w-full items-center justify-between gap-x-2">
                        <DeleteOrderButton order={order} />

                        <Button
                            type="submit"
                            className="flex items-center gap-x-2"
                        >
                            <Save className="size-4" />
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </motion.div>
    );
};

export default OrderForm;
