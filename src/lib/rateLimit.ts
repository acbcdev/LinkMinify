import { connectDB } from "@/lib/mongodb";
import RateLimit from "@/models/rateLimit";

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "10", 10);

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetsAt: Date;
  current: number;
};

/**
 * Get current date in YYYY-MM-DD format (UTC)
 */
function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get midnight of next day (when rate limit resets)
 */
function getResetTime(): Date {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  return tomorrow;
}

function isBypassed(ip: string): boolean {
  const bypassIps =
    process.env.RATE_LIMIT_BYPASS_IPS?.split(",").map((ip) => ip.trim()) || [];
  return bypassIps.includes(ip);
}

/**
 * Check and consume one rate-limit slot for an IP address.
 * If the IP is under the limit, increments its counter and allows the request.
 */
export async function consumeRateLimit(ip: string): Promise<RateLimitResult> {
  const resetsAt = getResetTime();

  if (isBypassed(ip)) {
    return { allowed: true, remaining: MAX_REQUESTS, resetsAt, current: 0 };
  }

  await connectDB();
  const currentDate = getCurrentDate();

  const record = await RateLimit.findOne({ ip, date: currentDate });
  const current = record?.count ?? 0;

  if (current >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetsAt, current };
  }

  await RateLimit.findOneAndUpdate(
    { ip, date: currentDate },
    { $inc: { count: 1 } },
    { upsert: true, new: true },
  );

  const newCount = current + 1;
  return {
    allowed: true,
    remaining: Math.max(0, MAX_REQUESTS - newCount),
    resetsAt,
    current: newCount,
  };
}
