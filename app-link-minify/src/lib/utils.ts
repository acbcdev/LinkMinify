import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function asegurarHttp(url: string): string {
  // Ampliamos la expresión regular para aceptar segmentos de ruta y parámetros más complejos.
  const regex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?([\?&\w\.-=]*)$/;
  // Verificamos si la URL cumple con la expresión regular ampliada.
  if (regex.test(url)) {
    // Verificamos si la URL ya comienza con http:// o https://.
    if (!/^https?:\/\//i.test(url)) {
      // Si no comienza con http:// o https://, le añadimos http:// al inicio.
      return `http://${url}`;
    }
    // Si la URL ya comienza con http:// o https://, la retornamos sin cambios.
    return url;
  }
  // Dado que deseamos aceptar URLs complejas, asumimos que cualquier entrada es una URL intentando ser válida.
  // Si no comienza con http:// o https://, le añadimos http:// al inicio.
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
