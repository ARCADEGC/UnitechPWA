"use client";

import { motion, cubicBezier } from "framer-motion";

import { Typography } from "@/components/ui/Typography";

import { CreateNewButton } from "@/app/dashboard/CreateNewButton";

function NoOrderFound({ userRole, userId }: { userRole: boolean; userId: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1) }}
            className="mx-auto py-24 text-center"
        >
            <Typography
                variant="h1"
                as="h2"
                className="tracking-wide"
            >
                No orders found
            </Typography>

            <Typography
                variant="muted"
                className="mb-8 mt-2 text-xl"
            >
                {userRole ? "Create a new order" : "Wait to be assigned a task"}
            </Typography>

            {userRole && (
                <CreateNewButton
                    id={userId}
                    name="New Order"
                />
            )}
        </motion.div>
    );
}

export { NoOrderFound };
