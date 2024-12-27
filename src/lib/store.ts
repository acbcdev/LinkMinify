import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Link {
  code: string;
  url: string;
  originalUrl: string;
}

interface LinkState {
  links: Link[];
  addLink: (newLink: Link) => void;
  updateLink: (code: string, newUrl: string) => void;
  deleteLink: (code: string) => void;
}

export const useLinkStore = create(
  persist<LinkState>(
    (set) => ({
      links: [],
      addLink: (newLink: Link) => {
        if (!newLink.code || !newLink.url) {
          throw new Error("Invalid link data");
        }
        set((state) => ({ links: [...state.links, newLink] }));
      },
      updateLink: (code, newUrl) =>
        set((state) => ({
          links: state.links.map((link) =>
            link.code === code ? { ...link, originalUrl: newUrl } : link
          ),
        })),
      deleteLink: (code) =>
        set((state) => ({
          ...state,
          links: state.links.filter((i) => i.code !== code),
        })),
    }),
    {
      name: "link-storage", // nombre del almacenamiento en localstorage
      storage: createJSONStorage(() => localStorage), // define localStorage como el método de almacenamiento
    }
  )
);
