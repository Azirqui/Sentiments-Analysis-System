import { randomInt } from "crypto"

export function generateOTP(length = 6, expiryMinutes = 10) {
  // Generate a random 6-digit OTP
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  const otp = randomInt(min, max).toString().padStart(length, "0")

  // Set expiry time (10 minutes from now)
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes)

  return { otp, expiresAt }
}
