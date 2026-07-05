import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
// eslint-disable-next-line import/no-unresolved
import { renderHook, act, waitFor } from "@testing-library/react";
import { useShortenUrl } from "@/hooks/useShortenUrl";
import { createUrl } from "@/actions/actions";
import { toast } from "sonner";
import { useLinkStore } from "@/lib/store";

// Mockear dependencias
vi.mock("@/actions/actions", () => ({
  createUrl: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/lib/store", () => ({
  useLinkStore: vi.fn(),
}));

describe("useShortenUrl", () => {
  const mockAddLink = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock de Zustand selector: el hook llama useLinkStore((s) => s.addLink)
    const mockedUseLinkStore = useLinkStore as unknown as Mock;
    mockedUseLinkStore.mockImplementation(
      (selector: (state: { addLink: typeof mockAddLink }) => any) =>
        selector({ addLink: mockAddLink }),
    );
  });

  it("debe inicializar con url vacío y loading false", () => {
    const { result } = renderHook(() => useShortenUrl());

    expect(result.current.url).toBe("");
    expect(result.current.loading).toBe(false);
  });

  it("setUrl debe actualizar el valor de url", () => {
    const { result } = renderHook(() => useShortenUrl());

    act(() => {
      result.current.setUrl("https://example.com");
    });

    expect(result.current.url).toBe("https://example.com");
  });

  it("debe mostrar error si url está vacío", async () => {
    const { result } = renderHook(() => useShortenUrl());

    await act(async () => {
      await result.current.createShortUrl();
    });

    expect(toast.error).toHaveBeenCalledWith("Please enter a URL");
    expect(createUrl).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("debe mostrar error si url es inválido", async () => {
    const { result } = renderHook(() => useShortenUrl());

    act(() => {
      result.current.setUrl("invalid-url");
    });

    await act(async () => {
      await result.current.createShortUrl();
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid URL");
    expect(createUrl).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("debe crear URL exitosamente y agregar al store", async () => {
    const mockResponse = {
      type: "success",
      code: "abc123",
      url: "https://example.com",
      rateLimit: { remaining: 9, resetsAt: new Date().toISOString() },
    };

    (createUrl as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useShortenUrl());

    act(() => {
      result.current.setUrl("https://example.com");
    });

    await act(async () => {
      await result.current.createShortUrl();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(createUrl).toHaveBeenCalledWith("https://example.com");
    expect(mockAddLink).toHaveBeenCalledWith({
      code: "abc123",
      url: "https://example.com",
    });
    expect(toast.success).toHaveBeenCalledWith(
      "Link created successfully. 9 remaining today.",
    );
    expect(result.current.url).toBe("");
  });

  it("debe manejar error de rate limit", async () => {
    const resetDate = new Date();
    resetDate.setHours(23, 59, 0, 0);

    const mockRateLimitResponse = {
      type: "rate_limited",
      current: 10,
      resetsAt: resetDate.toISOString(),
    };

    (createUrl as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockRateLimitResponse,
    );

    const { result } = renderHook(() => useShortenUrl());

    act(() => {
      result.current.setUrl("https://example.com");
    });

    await act(async () => {
      await result.current.createShortUrl();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith(
      `Daily limit reached (10/10). Resets at ${resetDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${resetDate
        .getMinutes()
        .toString()
        .padStart(2, "0")} UTC.`,
    );
    expect(mockAddLink).not.toHaveBeenCalled();
    expect(result.current.url).toBe("https://example.com");
  });

  it("debe manejar otros errores del servidor", async () => {
    (createUrl as ReturnType<typeof vi.fn>).mockResolvedValue({
      type: "error",
    });

    const { result } = renderHook(() => useShortenUrl());

    act(() => {
      result.current.setUrl("https://example.com");
    });

    await act(async () => {
      await result.current.createShortUrl();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "An error occurred, try again later",
    );
    expect(mockAddLink).not.toHaveBeenCalled();
  });

  it("debe manejar excepciones durante la creación", async () => {
    (createUrl as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useShortenUrl());

    act(() => {
      result.current.setUrl("https://example.com");
    });

    await act(async () => {
      await result.current.createShortUrl();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "An error occurred, try again later",
    );
    expect(mockAddLink).not.toHaveBeenCalled();
  });
});
