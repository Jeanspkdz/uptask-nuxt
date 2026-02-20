export type ErrorScopes = 'AUTH' | 'PROJECT' | 'GENERIC'

export type ProjectErrorCodes =
  | 'NAME_AND_CLIENT_NAME_ALREADY_EXISTS'

export type GenericErrorCodes =
  | 'UNKNOWN'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'

export type AuthErrorCodes =
  | 'INVALID_EMAIL_OR_PASSWORD'
  | 'INVALID_EMAIL'
  | 'INVALID_PASSWORD'
  | 'INVALID_TOKEN'
  | 'USER_ALREADY_EXISTS'
  | 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
  | 'USER_NOT_FOUND'
  | 'EMAIL_NOT_VERIFIED'
  | 'OTP_EXPIRED'
  | 'INVALID_OTP'
  | 'TOO_MANY_ATTEMPTS'
  | 'PASSWORD_TOO_SHORT'
  | 'PASSWORD_TOO_LONG'
  | 'SOCIAL_ACCOUNT_ALREADY_LINKED'
  | 'PROVIDER_NOT_FOUND'

export type ErrorScopesGroup = {
  AUTH: AuthErrorCodes
  GENERIC: GenericErrorCodes
  PROJECT: ProjectErrorCodes
}

export type ErrorCodes = {
  [Scope in keyof ErrorScopesGroup] : ErrorScopesGroup[Scope]
}[keyof ErrorScopesGroup]
