import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAmountLabel = (amount: string | number) => {
  if (amount === null || amount === undefined || isNaN(Number(amount)))
    return "";
  return `₹ ${Math.round(Number(amount)).toLocaleString("en-IN")}`;
};
