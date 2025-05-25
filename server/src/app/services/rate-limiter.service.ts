import rateLimit from 'express-rate-limit'

// Rate limiter: maximum of 5 requests per minute per IP
const RateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests attempts from this IP, please try again later.',
})

export { RateLimiter }
