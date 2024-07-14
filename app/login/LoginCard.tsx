"use client";

import { motion, cubicBezier } from "framer-motion";

import { LoginForm } from "@/components/login/Login";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/Typography";

function LoginCard() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: cubicBezier(0.4, 0, 0.2, 1), delay: 0.3 }}
            className="grid gap-2 py-12 [grid-column:content]"
        >
            <Card className="mx-auto w-full max-w-[32ch]">
                <CardHeader>
                    <Typography variant="h2">Login</Typography>
                    <CardDescription>Log into your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </motion.div>
    );
}

export { LoginCard };
