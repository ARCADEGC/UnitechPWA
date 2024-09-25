import {
    NumberInput as ArkNumberInput,
    type NumberInputRootProps,
} from "@ark-ui/react/number-input";
import { forwardRef, type ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NumberInputProps extends NumberInputRootProps, NumberInputVariantProps {
    children?: ReactNode;
}

export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>((props, ref) => {
    const { children, className, ...rootProps } = props;
    const { root, input } = styles({});

    return (
        <ArkNumberInput.Root
            ref={ref}
            className={root({ className })}
            formatOptions={{ useGrouping: false }}
            {...rootProps}
            min={0}
        >
            {children && <Label>{children}</Label>}
            <Input asChild>
                <ArkNumberInput.Control className="flex !py-0 !pr-0">
                    <ArkNumberInput.Input className={input()} />

                    <Button
                        asChild
                        size={"icon"}
                        variant={"ghost"}
                        className="aspect-square h-full rounded-none border-l print:hidden"
                    >
                        <ArkNumberInput.DecrementTrigger>
                            <Minus className="size-4" />
                        </ArkNumberInput.DecrementTrigger>
                    </Button>

                    <Button
                        asChild
                        size={"icon"}
                        variant={"ghost"}
                        className="aspect-square h-full rounded-l-none border-l print:hidden"
                    >
                        <ArkNumberInput.IncrementTrigger>
                            <Plus className="size-4" />
                        </ArkNumberInput.IncrementTrigger>
                    </Button>
                </ArkNumberInput.Control>
            </Input>
        </ArkNumberInput.Root>
    );
});

NumberInput.displayName = "NumberInput";

type NumberInputVariantProps = VariantProps<typeof styles>;

const styles = tv(
    {
        base: "numberInput",
        slots: {
            root: "numberInput__root",
            label: "numberInput__label",
            input: "numberInput__input",
            control: "numberInput__control",
            incrementTrigger: "numberInput__incrementTrigger",
            decrementTrigger: "numberInput__decrementTrigger",
            scrubber: "numberInput__scrubber",
        },
    },
    { twMerge: false },
);
