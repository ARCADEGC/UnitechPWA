"use client";

import { Printer } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

function PrintButton({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <Button
            variant={"secondary"}
            onClick={() => window.print()}
            className={cn("flex items-center gap-x-2 print:hidden", className)}
        >
            {children}
            <Printer className="size-4" />
        </Button>
    );
}

export { PrintButton };
