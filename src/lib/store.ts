import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Link {
  code: string;
  url: string;
}

type LinkStates = {
  links: Link[];
};

type LinkActions = {
  addLink: (newLink: Link) => void;
  updateLink: (code: string, newUrl: string) => void;
  deleteLink: (code: string) => void;
};
type LinkStore = LinkStates & LinkActions;

export const useLinkStore = create(
  persist<LinkStore>(
    (set) => ({
      links: [],
      addLink: (newLink: Link) => {
        set((state) => ({ links: [newLink, ...state.links] }));
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
