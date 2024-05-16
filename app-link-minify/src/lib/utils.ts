import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function sanitizeUrl(url: string): string | null {
  const regex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?([\?&\w\.-=]*)$/;

  // Si la entrada no es una URL válida, retornamos null.
  if (!regex.test(url)) {
    return null;
  }

  // Si la URL no comienza con http:// o https://, le añadimos http:// al inicio.
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }

  // Si la URL ya comienza con http:// o https://, la retornamos sin cambios.
  return url;
}
export function randomNum(): number {
  // Generates a random number between 0 (inclusive) and 1 (exclusive),
  // then scales it to the desired range (5 to 8 in this case) and rounds it down.
  // Math.random() * (max - min + 1) + min generates a range between min and max (inclusive),
  // where min = 5 and max = 8.
  return Math.floor(Math.random() * (8 - 5 + 1)) + 5;
}
