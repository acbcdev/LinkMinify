import RateLimit from "@/models/rateLimit";
import { connectDB } from "@/lib/mongodb";

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "10", 10);

/**
 * Get current date in YYYY-MM-DD format (UTC)
 */
function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Get midnight of next day (when rate limit resets)
 */
function getResetTime(): Date {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  return tomorrow;
}

/**
 * Check if an IP address can create a new shortened URL
 */
export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetsAt: Date;
  current: number;
}> {
  await connectDB();

  const currentDate = getCurrentDate();
  const resetsAt = getResetTime();

  // Check if IP is in bypass list
  const bypassIps = process.env.RATE_LIMIT_BYPASS_IPS?.split(",").map((ip) =>
    ip.trim()
  ) || [];
  if (bypassIps.includes(ip)) {
    return {
      allowed: true,
      remaining: MAX_REQUESTS,
      resetsAt,
      current: 0,
    };
  }

  // Find or create rate limit record for today
  let rateLimitRecord = await RateLimit.findOne({ ip, date: currentDate });

  if (!rateLimitRecord) {
    // No record for today, user can proceed
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetsAt,
      current: 0,
    };
  }

  const current = rateLimitRecord.count;
  const allowed = current < MAX_REQUESTS;
  const remaining = Math.max(0, MAX_REQUESTS - current - 1);

  return {
    allowed,
    remaining,
    resetsAt,
    current,
  };
}

/**
 * Increment the rate limit counter for an IP address
 */
export async function incrementRateLimit(ip: string): Promise<void> {
  await connectDB();

  const currentDate = getCurrentDate();

  // Check if IP is in bypass list
  const bypassIps = process.env.RATE_LIMIT_BYPASS_IPS?.split(",").map((ip) =>
    ip.trim()
  ) || [];
  if (bypassIps.includes(ip)) {
    return;
  }

  await RateLimit.findOneAndUpdate(
    { ip, date: currentDate },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
}
