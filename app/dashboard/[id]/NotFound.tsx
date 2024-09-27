"use client";

import Link from "next/link";
import { cubicBezier, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/Typography";

function NotFound() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1), delay: 0.3 }}
            className="flex h-[80svh] w-full flex-col items-center justify-center [grid-column:page]"
        >
            <Typography
                variant="h1"
                as="p"
                className="bg-gradient-to-br from-foreground from-40% to-muted bg-clip-text p-4 text-transparent"
            >
                Stránku se nepodařilo najít
            </Typography>
            <Button
                variant={"link"}
                asChild
            >
                <Typography
                    variant="anchor"
                    asChild
                >
                    <Link
                        href="/dashboard"
                        className="text-muted transition-colors hover:text-foreground"
                    >
                        Vrátit se na nástěnku
                    </Link>
                </Typography>
            </Button>
        </motion.div>
    );
}

export { NotFound };
