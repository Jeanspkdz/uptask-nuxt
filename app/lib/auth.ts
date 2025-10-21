import { createAuthClient } from 'better-auth/vue'
import { emailOTPClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
})

export const ERROR_MESSAGES = {
  UNKWONN_ERROR: 'Something went wrong',
}

type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    string
  >
>

const errorCodes = {
  USER_ALREADY_EXISTS: 'An account with this email already exists',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'This email is already in use',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  EMAIL_NOT_VERIFIED: 'Please verify your account before signing in',
  INVALID_OTP: 'Invalid code. Please try again',
  OTP_EXPIRED: 'Your verification code has expired. Please request a new one.'
} satisfies ErrorTypes

export const getErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes]
  }
  return ERROR_MESSAGES['UNKWONN_ERROR']
}
