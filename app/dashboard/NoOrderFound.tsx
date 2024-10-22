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
        >
            <div className="mx-auto py-24 text-center">
                <Typography
                    variant="h1"
                    as="h2"
                    className="tracking-wide"
                >
                    Žádné objednávky
                </Typography>

                <Typography
                    variant="muted"
                    className="mb-8 mt-2 text-xl"
                >
                    {userRole ? "Vytvořit novou objednávku" : "Vyčkejte na přiřazení objednávky"}
                </Typography>

                {userRole && <CreateNewButton userId={userId} />}
            </div>
        </motion.div>
    );
}

export { NoOrderFound };
