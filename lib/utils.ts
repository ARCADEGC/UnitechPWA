import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getInitials(string: string): string {
    const words = string.split(" ");
    if (!words) return "A";
    return words.length === 1 ?
            words[0].charAt(0).toUpperCase()
        :   `${words[0].charAt(0).toUpperCase()}${words[words.length - 1].charAt(0).toUpperCase()}`;
}
