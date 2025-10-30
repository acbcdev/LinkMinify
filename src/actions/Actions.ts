"use server";

import { nanoid } from "nanoid";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { randomNum } from "@/lib/utils";
import Hash from "@/models/hash";
import { checkRateLimit, incrementRateLimit } from "@/lib/rateLimit";

export async function GetUrl(hash: string) {
  "use server";
  await connectDB();
  const result = await Hash.findOne({ code: hash });
  return result.url;
}
export async function CreateUrl(url: string) {
  "use server";
  try {
    // Get IP address from headers
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    const rateLimit = await checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return JSON.stringify({
        error: "RATE_LIMIT_EXCEEDED",
        message: `Daily limit reached (${rateLimit.current}/${process.env.RATE_LIMIT_MAX || "10"}). Resets at midnight UTC.`,
        resetsAt: rateLimit.resetsAt.toISOString(),
        current: rateLimit.current,
      });
    }

    await connectDB();
    let urlToShort = url;
    if (!/^(https?:\/\/)/.test(url)) {
      urlToShort = `https://${url}`;
    }
    const result = await Hash.create({
      url: urlToShort,
      code: nanoid(randomNum()),
    });

    // Increment rate limit counter after successful creation
    await incrementRateLimit(ip);

    return JSON.stringify({
      ...result.toObject(),
      rateLimit: {
        remaining: rateLimit.remaining,
        resetsAt: rateLimit.resetsAt.toISOString(),
      },
    });
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error });
  }
}

export async function DeleteUrl(code: string) {
  "use server";
  try {
    await connectDB();
    const result = await Hash.deleteOne({ code });
    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    return JSON.stringify({ error });
  }
}
