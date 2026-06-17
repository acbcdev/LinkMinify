"use server";

import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { generateCode, normalizeUrl } from "@/lib/utils";
import Hash from "@/models/hash";
import { consumeRateLimit } from "@/lib/rateLimit";

const MAX_RETRIES = 5;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === 11000
  );
}

async function createWithUniqueCode(url: string, attempt = 1) {
  try {
    return await Hash.create({ url, code: generateCode() });
  } catch (err) {
    if (!isDuplicateKeyError(err)) throw err; // otro error → NO te lo tragues
    if (attempt >= MAX_RETRIES) {
      throw new Error(
        `Failed to generate unique code after ${MAX_RETRIES} attempts`,
      );
    }
    return createWithUniqueCode(url, attempt + 1); // colisión → reintenta
  }
}

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
    const result = await createWithUniqueCode(normalizeUrl(url));

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
