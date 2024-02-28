// Definimos un tipo para la lista de URLs
type ListaURLs = string[];

// 1. Función para inicializar el arreglo de URLs en localStorage
export function inicializarLocalStorage(): void {
  if (localStorage.getItem("urlsCreated") === null) {
    localStorage.setItem("urlsCreated", JSON.stringify([]));
  }
}

// 2. Función para añadir una URL al localStorage
export function anadirURL(url: string): void {
  // Primero, obtenemos la lista actual de URLs
  const listaURLs: ListaURLs = JSON.parse(
    localStorage.getItem("urlsCreated") || "[]"
  );
  // Añadimos la nueva URL
  listaURLs.push(url);
  // Guardamos la lista actualizada en localStorage
  localStorage.setItem("urlsCreated", JSON.stringify(listaURLs));
}

// 3. Función para obtener la lista de URLs
export function obtenerListaURLs(): ListaURLs {
  return JSON.parse(localStorage.getItem("urlsCreated") || "[]");
}

// 4. Función para eliminar una URL específica
export function eliminarURL(url: string): void {
  let listaURLs: ListaURLs = JSON.parse(
    localStorage.getItem("urlsCreated") || "[]"
  );
  // Filtramos la lista para eliminar la URL específica
  listaURLs = listaURLs.filter((u) => u !== url);
  // Guardamos la lista actualizada
  localStorage.setItem("urlsCreated", JSON.stringify(listaURLs));
}
