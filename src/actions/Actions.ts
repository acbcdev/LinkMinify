"use server";

import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { normalizeUrl, randomNum } from "@/lib/utils";
import Hash from "@/models/hash";
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
  await connectDB();
  const result = await Hash.findOneAndUpdate(
    { code: hash },
    { $inc: { clicked: 1 } },
  );
  return result?.url ?? null;
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

    await connectDB();
    const result = await Hash.create({
      url: normalizeUrl(url),
      code: nanoid(randomNum()),
    });

    return {
      type: "success",
      code: result.code,
      url: result.url,
      rateLimit: {
        remaining: rateLimit.remaining,
        resetsAt: rateLimit.resetsAt.toISOString(),
      },
    };
  } catch (error) {
    console.log(error);
    return { type: "error" };
  }
}

export async function DeleteUrl(
  code: string,
): Promise<{ type: "success"; deletedCount: number } | { type: "error" }> {
  "use server";
  try {
    await connectDB();
    const result = await Hash.deleteOne({ code });
    return { type: "success", deletedCount: result.deletedCount };
  } catch (error) {
    console.log(error);
    return { type: "error" };
  }
}
