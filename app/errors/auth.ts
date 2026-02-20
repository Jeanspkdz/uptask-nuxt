import { GENERIC_ERROR_MESSAGES } from './generic'

export const AUTH_ERROR_MESSAGES = {
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  INVALID_EMAIL: 'The email address is invalid',
  INVALID_PASSWORD: 'The password you entered is incorrect.',
  INVALID_TOKEN: 'The provided token is invalid',
  USER_ALREADY_EXISTS: 'An account with this email already exists',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'This email is already in use',
  USER_NOT_FOUND: 'No user found with the provided credentials',
  EMAIL_NOT_VERIFIED: 'Please verify your account before signing in',
  OTP_EXPIRED: 'Your verification code has expired. Please request a new one.',
  INVALID_OTP: 'Invalid code. Please try again',
  TOO_MANY_ATTEMPTS: 'Too many failed attempts. Please try again later',
  PASSWORD_TOO_SHORT: 'The password is too short',
  PASSWORD_TOO_LONG: 'The password is too long',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'This social account is already linked to another user',
  PROVIDER_NOT_FOUND: 'Authentication provider not found'
} satisfies Record<AuthErrorCodes, string>

export const getAuthErrorMessage = (code: string) => {
  if (code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[code as keyof typeof AUTH_ERROR_MESSAGES]
  }
  return GENERIC_ERROR_MESSAGES['UNKNOWN']
}
