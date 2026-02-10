import type { ErrorDetails } from '.'

export type GenericErrors = {
  [K in GenericErrorCodes]: ErrorDetails<K>;
}

export const GENERIC_ERRORS = {
  FORBIDDEN: {
    code: 'FORBIDDEN',
    status: 403,
    message: "You don't have permission to perform this action",
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    status: 401,
    message: 'You need to be logged in to perform this action',
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    status: 400,
    message: 'The request was invalid or cannot be processed',
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    status: 404,
    message: 'The requested resource could not be found',
  },
  UNKNOWN: {
    code: 'UNKNOWN',
    status: 500,
    message: 'Something went wrong. Please try again',
  },
} as const satisfies GenericErrors
