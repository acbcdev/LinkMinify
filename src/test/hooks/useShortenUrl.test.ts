import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
// eslint-disable-next-line import/no-unresolved
import { renderHook, act, waitFor } from "@testing-library/react";
import { useShortenUrl } from "@/hooks/useShortenUrl";
import { CreateUrl } from "@/actions/Actions";
import { toast } from "sonner";
import { useLinkStore } from "@/lib/store";

// Mockear dependencias
vi.mock("@/actions/Actions", () => ({
  CreateUrl: vi.fn(),
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
        selector({ addLink: mockAddLink })
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
    expect(CreateUrl).not.toHaveBeenCalled();
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
    expect(CreateUrl).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("debe crear URL exitosamente y agregar al store", async () => {
    const mockResponse = {
      code: "abc123",
      url: "https://example.com",
      rateLimit: { remaining: 9, resetsAt: new Date().toISOString() },
    };

    (CreateUrl as ReturnType<typeof vi.fn>).mockResolvedValue(
      JSON.stringify(mockResponse)
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

    expect(CreateUrl).toHaveBeenCalledWith("https://example.com");
    expect(mockAddLink).toHaveBeenCalledWith(mockResponse);
    expect(toast.success).toHaveBeenCalledWith(
      "Link created successfully. 9 remaining today."
    );
    expect(result.current.url).toBe("");
  });

  it("debe manejar error de rate limit", async () => {
    const resetDate = new Date();
    resetDate.setHours(23, 59, 0, 0);

    const mockRateLimitResponse = {
      error: "RATE_LIMIT_EXCEEDED",
      current: 10,
      resetsAt: resetDate.toISOString(),
    };

    (CreateUrl as ReturnType<typeof vi.fn>).mockResolvedValue(
      JSON.stringify(mockRateLimitResponse)
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
        .padStart(2, "0")} UTC.`
    );
    expect(mockAddLink).not.toHaveBeenCalled();
    expect(result.current.url).toBe("https://example.com");
  });

  it("debe manejar otros errores del servidor", async () => {
    const mockErrorResponse = {
      error: "Some server error",
    };

    (CreateUrl as ReturnType<typeof vi.fn>).mockResolvedValue(
      JSON.stringify(mockErrorResponse)
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
      "An error occurred, try again later"
    );
    expect(mockAddLink).not.toHaveBeenCalled();
  });

  it("debe manejar excepciones durante la creación", async () => {
    (CreateUrl as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network error")
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
      "An error occurred, try again later"
    );
    expect(mockAddLink).not.toHaveBeenCalled();
  });

  it("debe mostrar mensaje de éxito sin rateLimit si no está presente", async () => {
    const mockResponse = {
      code: "xyz789",
      url: "https://midu.dev",
    };

    (CreateUrl as ReturnType<typeof vi.fn>).mockResolvedValue(
      JSON.stringify(mockResponse)
    );

    const { result } = renderHook(() => useShortenUrl());

    act(() => {
      result.current.setUrl("https://midu.dev");
    });

    await act(async () => {
      await result.current.createShortUrl();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(toast.success).toHaveBeenCalledWith("Link created successfully");
  });
});
