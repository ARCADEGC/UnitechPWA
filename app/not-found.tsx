"use client";

import Link from "next/link";

import { cubicBezier, motion } from "framer-motion";

import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";

function NotFound() {
    return (
        <div className="[grid-column:page] *:flex *:h-svh *:w-full *:flex-col *:items-center *:justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1), delay: 0.3 }}
            >
                <Typography
                    variant="h1"
                    as="p"
                    className="bg-gradient-to-br from-foreground from-40% to-muted bg-clip-text p-4 text-transparent"
                >
                    Nepodařilo se najít stránku
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
                            href="/"
                            className="text-muted transition-colors hover:text-foreground"
                        >
                            Vrátit se
                        </Link>
                    </Typography>
                </Button>
            </motion.div>
        </div>
    );
}

export default NotFound;
