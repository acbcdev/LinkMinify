import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomNum(): number {
  // Generates a random number between 0 (inclusive) and 1 (exclusive),
  // then scales it to the desired range (5 to 8 in this case) and rounds it down.
  // Math.random() * (max - min + 1) + min generates a range between min and max (inclusive),
  // where min = 5 and max = 8.
  return Math.floor(Math.random() * (8 - 5 + 1)) + 5;
}
