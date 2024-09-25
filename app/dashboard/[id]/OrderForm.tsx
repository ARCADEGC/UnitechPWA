"use client";

import React, { useRef, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { motion, cubicBezier } from "framer-motion";

import { Save } from "lucide-react";

import { getIdByUserName, getPriceAtDate, getUserNameById, getUsers } from "@/db/db";
// import { updateOrder } from "@/db/db";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

import { DeleteOrderButton } from "@/app/dashboard/[id]/DeteteOrderButton";

import { TOrder, TUser } from "@/types/dbSchemas";
import { Input } from "@/components/ui/input";

type TOrderFormProps = {
    order: TOrder;
    userRole: boolean;
};

async function OrderForm({ order, userRole }: TOrderFormProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
        >
            <FormField
                name="shipmentZoneOne"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Shipment Zone One</FormLabel>
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
            {/* <div>{price ?? "no price"}</div> */}
        </motion.div>
    );
}

export default OrderForm;
