export type ErrorScopes = 'AUTH' | 'PROJECT' | 'GENERIC'

export type ProjectErrorCodes =
  | 'NAME_AND_CLIENT_NAME_ALREADY_EXISTS'

export type GenericErrorCodes =
  | 'UNKNOWN'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'

export type ErrorCodes = ProjectErrorCodes | GenericErrorCodes

// export type AuthErrorCodes =
//   | 'FORBIDDEN'
