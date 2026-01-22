import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Handles conflicts intelligently (e.g., "p-4 p-2" → "p-2")
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
