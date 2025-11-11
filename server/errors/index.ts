import type { GenericErrorCodes } from '#shared/types/error'

type GenericErrorMessages = {
  [K in keyof GenericErrorCodes]: GenericErrorCodesValue<K>
}

export type GenericErrorCodesValue<T extends string = string> = {
  code: T,
  message: string
}

export type ErrorData = GenericErrorCodesValue & { reason: string }

export const GENERIC_ERROR_MESSAGES: GenericErrorMessages = {
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
} satisfies GenericErrorMessages
