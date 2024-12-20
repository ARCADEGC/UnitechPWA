"use client";

import { motion, cubicBezier } from "framer-motion";

import { Typography } from "@/components/ui/Typography";

function Loading() {
    return (
        <div className="[grid-column:page] *:flex *:h-svh *:w-full *:items-center *:justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1), delay: 0.3 }}
            >
                <div className="flex animate-pulse items-center justify-center rounded-lg bg-gradient-to-br from-background to-muted p-4">
                    <Typography
                        variant="h1"
                        as="p"
                        className="animate-low-pulse bg-gradient-to-br from-foreground from-40% to-muted bg-clip-text p-4 text-transparent"
                    >
                        Načítání...
                    </Typography>
                </div>
            </motion.div>
        </div>
    );
}

export default Loading;
