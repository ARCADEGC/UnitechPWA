"use client";

import Link from "next/link";

import { motion, cubicBezier } from "framer-motion";

import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";

function LoginRequest() {
    return (
        <div className="[grid-column:content] *:flex *:min-h-svh *:flex-col *:items-center *:justify-center *:gap-4 *:text-center">
            <motion.main
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1), delay: 0.5 }}
            >
                <Typography
                    variant="h3"
                    as="p"
                >
                    Vypadá to že nejste přihlášeni
                </Typography>
                <Button asChild>
                    <Link href="login">Přihlásit se</Link>
                </Button>
            </motion.main>
        </div>
    );
}

export { LoginRequest };
