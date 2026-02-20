import type { ErrorDetails } from '.'

export type AuthErrors = {
  [K in AuthErrorCodes]: ErrorDetails<K>;
}

export const AUTH_ERRORS = {
  INVALID_EMAIL_OR_PASSWORD: {
    code: 'INVALID_EMAIL_OR_PASSWORD',
    status: 401,
    message: 'Invalid email or password',
  },
  INVALID_EMAIL: {
    code: 'INVALID_EMAIL',
    status: 400,
    message: 'The email address is invalid',
  },
  INVALID_PASSWORD: {
    code: 'INVALID_PASSWORD',
    status: 400,
    message: 'The password is incorrect',
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    status: 400,
    message: 'The token is invalid or has expired',
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    status: 409,
    message: 'An account with this email already exists',
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    code: 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL',
    status: 409,
    message: 'This email is taken, please use another one',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    status: 404,
    message: 'No account found with this email',
  },
  EMAIL_NOT_VERIFIED: {
    code: 'EMAIL_NOT_VERIFIED',
    status: 403,
    message: 'Please verify your email before continuing',
  },
  OTP_EXPIRED: {
    code: 'OTP_EXPIRED',
    status: 400,
    message: 'The OTP has expired, please request a new one',
  },
  INVALID_OTP: {
    code: 'INVALID_OTP',
    status: 400,
    message: 'The OTP is invalid',
  },
  TOO_MANY_ATTEMPTS: {
    code: 'TOO_MANY_ATTEMPTS',
    status: 429,
    message: 'Too many attempts, please try again later',
  },
  PASSWORD_TOO_SHORT: {
    code: 'PASSWORD_TOO_SHORT',
    status: 400,
    message: 'Password must be at least 8 characters',
  },
  PASSWORD_TOO_LONG: {
    code: 'PASSWORD_TOO_LONG',
    status: 400,
    message: 'Password must be less than 128 characters',
  },
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    code: 'SOCIAL_ACCOUNT_ALREADY_LINKED',
    status: 409,
    message: 'This social account is already linked to another user',
  },
  PROVIDER_NOT_FOUND: {
    code: 'PROVIDER_NOT_FOUND',
    status: 404,
    message: 'The authentication provider was not found',
  },
} as const satisfies AuthErrors
