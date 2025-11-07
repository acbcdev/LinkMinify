import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (clsx + tailwind-merge)", () => {
  it("fusiona clases condicionales", () => {
    const result = cn("p-2", false && "hidden", "text-sm");
    expect(result).toBe("p-2 text-sm");
  });

  it("resuelve conflictos de Tailwind correctamente", () => {
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });
});
