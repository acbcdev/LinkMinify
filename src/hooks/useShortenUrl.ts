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
      const rta = await CreateUrl(url);
      const data = JSON.parse(rta);

      // Check for rate limit error
      if (data.error === "RATE_LIMIT_EXCEEDED") {
        const resetDate = new Date(data.resetsAt);
        const hours = resetDate.getHours().toString().padStart(2, "0");
        const minutes = resetDate.getMinutes().toString().padStart(2, "0");
        toast.error(
          `Daily limit reached (${data.current}/10). Resets at ${hours}:${minutes} UTC.`
        );
        setLoading(false);
        return;
      }

      // Check for other errors
      if (data.error) {
        toast.error("An error occurred, try again later");
        setLoading(false);
        return;
      }

      setUrl("");
      addLink(data);

      // Show success message with remaining count
      const remaining = data.rateLimit?.remaining;
      if (remaining !== undefined) {
        toast.success(`Link created successfully. ${remaining} remaining today.`);
      } else {
        toast.success("Link created successfully");
      }
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
