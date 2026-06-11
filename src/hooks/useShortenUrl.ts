import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateUrl } from "@/actions/Actions";
import { useLinkStore } from "@/lib/store";
import { IsValidUrl } from "@/lib/utils";

export function useShortenUrl() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const addLink = useLinkStore((state) => state.addLink);

  const createShortUrl = async () => {
    setLoading(true);

    if (url.trim() === "") {
      toast.error("Please enter a URL");
      setLoading(false);
      return;
    }

    if (!IsValidUrl(url)) {
      toast.error("Invalid URL");
      setLoading(false);
      return;
    }

    try {
      const result = await CreateUrl(url);

      if (result.type === "rate_limited") {
        const resetDate = new Date(result.resetsAt);
        const hours = resetDate.getHours().toString().padStart(2, "0");
        const minutes = resetDate.getMinutes().toString().padStart(2, "0");
        toast.error(
          `Daily limit reached (${result.current}/10). Resets at ${hours}:${minutes} UTC.`,
        );
        setLoading(false);
        return;
      }

      if (result.type === "error") {
        toast.error("An error occurred, try again later");
        setLoading(false);
        return;
      }

      setUrl("");
      addLink({ code: result.code, url: result.url });
      toast.success(
        `Link created successfully. ${result.rateLimit.remaining} remaining today.`,
      );
    } catch {
      toast.error("An error occurred, try again later");
    } finally {
      setLoading(false);
    }
  };

  return {
    url,
    setUrl,
    loading,
    createShortUrl,
  };
}
