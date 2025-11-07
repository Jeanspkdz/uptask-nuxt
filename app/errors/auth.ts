import type { authClient } from '~/lib/auth'
import { GENERIC_ERROR_MESSAGES } from '.'

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    string
  >
>

export const AUTH_ERROR_CODES = {
  USER_ALREADY_EXISTS: 'An account with this email already exists',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'This email is already in use',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  EMAIL_NOT_VERIFIED: 'Please verify your account before signing in',
  INVALID_OTP: 'Invalid code. Please try again',
  OTP_EXPIRED: 'Your verification code has expired. Please request a new one.'
} satisfies ErrorTypes

export const getAuthErrorMessage = (code: string) => {
  if (code in AUTH_ERROR_CODES) {
    return AUTH_ERROR_CODES[code as keyof typeof AUTH_ERROR_CODES]
  }
  return GENERIC_ERROR_MESSAGES['UNKNOWN']
}
