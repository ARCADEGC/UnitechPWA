"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Printer } from "lucide-react";

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
