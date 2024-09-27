import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/Typography";

type TUnitProps = {
    value: string | number | undefined;
    unit?: string;
    per?: string;
    variant?:
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "p"
        | "blockquote"
        | "table"
        | "list"
        | "code"
        | "lead"
        | "large"
        | "small"
        | "muted"
        | "anchor";
    className?: string;
    as?: string;
    asChild?: boolean;
    disableSelect?: boolean;
};

function Unit({
    value = "",
    unit,
    per = "",
    variant,
    className,
    as,
    asChild,
    disableSelect,
    ...props
}: TUnitProps) {
    return (
        <Typography
            variant={variant}
            as={as}
            asChild={asChild}
            disableSelect={disableSelect}
            className={cn("!mt-0 text-xs text-muted-foreground print:text-black", className)}
            {...props}
        >
            {value}
            {unit && ` ${unit}`}
            {per && ` / ${per}`}
        </Typography>
    );
}

export { Unit };
