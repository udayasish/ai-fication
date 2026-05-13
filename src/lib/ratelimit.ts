import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 5 requests per 10 minutes per IP on the leads endpoint.
export const leadsRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "leads",
});
