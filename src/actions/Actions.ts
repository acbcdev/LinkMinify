"use server";

import { after } from "next/server";
import { headers } from "next/headers";
import { normalizeUrl } from "@/lib/utils";
import { linkRepository } from "@/lib/db";
import { consumeRateLimit } from "@/lib/rateLimit";

export type CreateUrlResult =
  | {
      type: "success";
      code: string;
      url: string;
      rateLimit: { remaining: number; resetsAt: string };
    }
  | { type: "rate_limited"; current: number; resetsAt: string }
  | { type: "error" };

export async function GetUrl(hash: string): Promise<string | null> {
  "use server";
  const link = await linkRepository.trackClick(hash);
  return link?.url ?? null;
}
export async function CreateUrl(url: string): Promise<CreateUrlResult> {
  "use server";
  try {
    // Get IP address from headers
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Check and consume rate limit
    const rateLimit = await consumeRateLimit(ip);

    if (!rateLimit.allowed) {
      return {
        type: "rate_limited",
        current: rateLimit.current,
        resetsAt: rateLimit.resetsAt.toISOString(),
      };
    }

    const link = await linkRepository.create(normalizeUrl(url));

    return {
      type: "success",
      code: link.code,
      url: link.url,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetsAt: rateLimit.resetsAt.toISOString(),
      },
    };
  } catch (error) {
    after(() => console.log(error));
    return { type: "error" };
  }
}

export async function DeleteUrl(
  code: string,
): Promise<{ type: "success"; deletedCount: number } | { type: "error" }> {
  "use server";
  try {
    const deletedCount = await linkRepository.deleteByCode(code);
    return { type: "success", deletedCount };
  } catch (error) {
    after(() => console.log(error));
    return { type: "error" };
  }
}
