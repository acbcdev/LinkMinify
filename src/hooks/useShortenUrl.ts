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
      setUrl("");
      addLink(data);
      toast.success("Link created successfully");
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
