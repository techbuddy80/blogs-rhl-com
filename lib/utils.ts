import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn/ui helper — merges Tailwind classes without specificity
// collisions. Used by every component in components/ui.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
