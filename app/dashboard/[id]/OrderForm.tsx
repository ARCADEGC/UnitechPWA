"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateOrder } from "@/db/db";

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

import { TOrder } from "@/types/dbSchemas";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    content: z.object({}),
    author: z.string(),
    secretMessage: z.string(),
});

type TOrderFormProps = {
    order: TOrder;
    role: boolean;
};

function OrderForm({ order, role }: TOrderFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: order?.name ?? "",
            content: order?.content ?? {},
            author: order?.author ?? "",
            secretMessage: order?.secretMessage ?? "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await updateOrder(
                {
                    ...values,
                    id: order?.id,
                },
                role,
            );
            return toast("Successfully updated.");
        } catch {
            return toast("Something went wrong. Please wait or try refreshing the page.");
        }
    }

    return (
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
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {role && (
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
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

export { OrderForm };
