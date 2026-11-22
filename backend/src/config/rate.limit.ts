import rateLimit from "express-rate-limit";

export const reteLimiter = rateLimit({
  windowMs: Number(process.env.REFRESH_RATE_LIMIT_WINDOW),
  max: Number(process.env.REFRESH_RATE_LIMIT_MAX),
  message: "Too many refresh attempts. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Booking form protection (no OTP for now): max 5 booking attempts per hour per device/IP.
 * Override with BOOKING_RATE_LIMIT_MAX / BOOKING_RATE_LIMIT_WINDOW_MS if needed.
 */
export const bookingLimiter = rateLimit({
  windowMs: Number(process.env.BOOKING_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000,
  max: Number(process.env.BOOKING_RATE_LIMIT_MAX) || 5,
  message: {
    success: false,
    message: "Too many booking attempts from this device. Please try again in an hour or contact us on WhatsApp.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});