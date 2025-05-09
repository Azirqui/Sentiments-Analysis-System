import { Redis } from "@upstash/redis"

// Create Redis client
// In a real application, you would use environment variables for the Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

export async function rateLimit(
  ip: string,
  limit = 10,
  duration = 60, // in seconds
  prefix = "rate-limit:",
) {
  const key = `${prefix}${ip}`

  try {
    const requests = await redis.incr(key)

    // If this is the first request, set an expiry
    if (requests === 1) {
      await redis.expire(key, duration)
    }

    // Get the TTL (time to live) for the key
    const ttl = await redis.ttl(key)

    return {
      success: requests <= limit,
      limit,
      remaining: Math.max(0, limit - requests),
      reset: Date.now() + ttl * 1000,
    }
  } catch (error) {
    console.error("Rate limiting error:", error)

    // If Redis fails, allow the request to proceed
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Date.now() + duration * 1000,
    }
  }
}
