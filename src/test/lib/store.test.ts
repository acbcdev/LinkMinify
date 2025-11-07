import { describe, it, expect, beforeEach } from "vitest";
import { useLinkStore } from "@/lib/store";

// Helper to reset Zustand store and localStorage between tests
function resetStore() {
  // Clear persisted storage
  localStorage.clear();
  // Reset in-memory state
  const { links } = useLinkStore.getState();
  if (links.length > 0) {
    useLinkStore.setState({ links: [] });
  }
}

describe("useLinkStore (Zustand)", () => {
  beforeEach(() => {
    resetStore();
  });

  it("addLink debe agregar al inicio de la lista", () => {
    const { addLink, links } = useLinkStore.getState();
    expect(links).toEqual([]);

    addLink({ code: "abc12", url: "https://example.com" });
    addLink({ code: "xyz99", url: "https://midu.dev" });

    const state = useLinkStore.getState();
    expect(state.links).toHaveLength(2);
    expect(state.links[0]).toEqual({ code: "xyz99", url: "https://midu.dev" });
    expect(state.links[1]).toEqual({
      code: "abc12",
      url: "https://example.com",
    });
  });

  it("deleteLink debe eliminar por code", () => {
    const { addLink, deleteLink } = useLinkStore.getState();
    addLink({ code: "keep1", url: "https://a.com" });
    addLink({ code: "drop2", url: "https://b.com" });
    addLink({ code: "keep3", url: "https://c.com" });

    deleteLink("drop2");

    const { links } = useLinkStore.getState();
    expect(links.map((l) => l.code)).toEqual(["keep3", "keep1"]);
  });

  it("updateLink debe actualizar el campo url del elemento", () => {
    const { addLink, updateLink } = useLinkStore.getState();
    addLink({ code: "edit1", url: "https://old.com" });

    updateLink("edit1", "https://new.com");

    const { links } = useLinkStore.getState();
    expect(links[0]).toEqual({ code: "edit1", url: "https://new.com" });
  });
});
