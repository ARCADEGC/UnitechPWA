"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { useMemo, memo } from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = memo(({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    const toastOptions = useMemo(
        () => ({
            classNames: {
                toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                description: "group-[.toast]:text-muted-foreground",
                actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            },
        }),
        [theme], // Add theme as a dependency to recalculate toastOptions when theme changes
    );

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className="toaster group"
            toastOptions={toastOptions}
            {...props}
        />
    );
});

export { Toaster };
