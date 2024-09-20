"use client";

import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";

import { getIdByUserName, getUserNameById, getUsers, updateOrderHeader } from "@/db/db";

import { cn } from "@/lib/utils";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { TOrderHeader, TUser } from "@/types/dbSchemas";
import { formHeaderSchema } from "@/types/orderForm";
import { cubicBezier, motion } from "framer-motion";

type TFormHeaderProps = {
    orderHeader: TOrderHeader;
    userRole: boolean;
};

function FormHeader({ orderHeader, userRole }: TFormHeaderProps) {
    const [users, setUsers] = useState<TUser[]>([]);

    const form = useForm<z.infer<typeof formHeaderSchema>>({
        resolver: zodResolver(formHeaderSchema),
        defaultValues: {
            customer: orderHeader.customer,
            address: orderHeader.address,
            phone: orderHeader.phone,
            email: orderHeader.email,
            assignee: orderHeader.assignee,
            dueDate: orderHeader.dueDate,
            orderNumber: orderHeader.orderNumber,
            ikeaNumber: orderHeader.ikeaNumber,
        },
        mode: "all",
    });

    useEffect(() => {
        const getAssignee = async () => {
            const assignedUser = (await getUserNameById(orderHeader.assignee)) ?? "";
            form.setValue("assignee", assignedUser);
        };

        getAssignee();
    }, [orderHeader.assignee]);

    useEffect(() => {
        const fetchUsers = async () => {
            const userList = await getUsers();
            setUsers(userList);
        };

        fetchUsers();
    }, []);

    async function onSubmit(values: z.infer<typeof formHeaderSchema>) {
        try {
            const updatedOrder: TOrderHeader = {
                address: values.address,
                phone: values.phone,
                email: values.email,
                dueDate: values.dueDate,
                orderNumber: values.orderNumber,
                ikeaNumber: values.ikeaNumber,
                customer: values.customer,
                assignee: (await getIdByUserName(values.assignee as string)) ?? "", // TODO duplicate names
            };

            const promise = updateOrderHeader(orderHeader.id as string, updatedOrder, userRole);

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

    const debouncedSubmit = useCallback(
        debounce(async () => {
            onSubmit(form.getValues());
        }, 500),
        [orderHeader, userRole],
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
                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1), delay: 0.3 }}
            >
                <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer</FormLabel>
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

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="order address"
                                    autoComplete="on"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="grid">
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
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
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="assignee"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Assigned Team</FormLabel>
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

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="order phone"
                                    autoComplete="on"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="order email"
                                    autoComplete="on"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Order Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="order number"
                                    autoComplete="on"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </motion.form>
        </Form>
    );
}

export default FormHeader;
