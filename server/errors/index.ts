import type { ErrorCodes, ErrorScopes, GenericErrorCodes } from '#shared/types/error'

export type ErrorData = ErrorDetails<ErrorCodes> & { reason?: string, scope: ErrorScopes }

type GenericErrorDef = {
  [K in GenericErrorCodes]: ErrorDetails<K>
}

export type ErrorDetails<T extends string = string> = {
  code: T,
  message: string
}

export const GENERIC_ERRORS = {
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: "You don't have permission to perform this action",
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'You need to be logged in to perform this action',
  },
  UNKNOWN: {
    code: 'UNKNOWN',
    message: 'Something went wrong. Please try again',
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'The request was invalid or cannot be processed',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'The requested resource could not be found'
  }
} satisfies GenericErrorDef
