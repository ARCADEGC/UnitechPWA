"use client";

import { motion, cubicBezier } from "framer-motion";

import { LoginForm } from "@/components/login/Login";
import { Typography } from "@/components/ui/Typography";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

function LoginCard() {
    return (
        <div className="grid gap-2 py-12 [grid-column:content]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1), delay: 0.3 }}
            >
                <Card className="mx-auto w-full max-w-[32ch]">
                    <CardHeader>
                        <Typography variant="h2">Přihlášeni</Typography>
                        <CardDescription>Přihlašte se do svého účtu</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

export { LoginCard };
