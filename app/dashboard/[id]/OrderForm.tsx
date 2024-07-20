"use client";

import React, { useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";

import { CheckCircle, Eraser, Save } from "lucide-react";

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
import { Label } from "@/components/ui/label";

import { DeleteOrderButton } from "@/app/dashboard/[id]/DeteteOrderButton";

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
            author: order?.author ?? "",
            secretMessage: order?.secretMessage ?? "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const promise = updateOrder(
                {
                    ...values,
                    id: order?.id,
                    signature: sigCanvasRef.current?.toData(),
                },
                role,
            )
                .then(() => router.refresh())
                .finally(() =>
                    setTimeout(() => {
                        toast.promise(promise, {
                            loading: "Updating order...",
                            success: () => {
                                return "Order updated successfully.";
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
    );
}

export { OrderForm };
