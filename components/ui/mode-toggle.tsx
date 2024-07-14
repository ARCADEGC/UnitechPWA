"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { setTheme } = useTheme();

    return (
        <Button
            variant="outline"
            className="relative aspect-square h-full !p-0 *:size-full"
        >
            <SunIcon
                onClick={() => setTheme("dark")}
                aria-label="Toggle theme to dark"
                className="size-[1.2rem] rotate-0 scale-100 p-2 transition-all dark:-rotate-90 dark:scale-0"
            />
            <MoonIcon
                onClick={() => setTheme("light")}
                aria-label="Toggle theme to light"
                className="absolute size-[1.2rem] rotate-90 scale-0 p-2 transition-all dark:rotate-0 dark:scale-100"
            />
        </Button>
    );
}
