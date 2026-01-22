import type { ErrorScopes, GenericErrorCodes } from '~~/shared/types/error'
import { AUTH_ERROR_MESSAGES } from './auth'
import { PROJECT_ERROR_MESSAGES } from './project'

export const GENERIC_ERROR_MESSAGES = {
  UNKNOWN: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  BAD_REQUEST: 'The request was invalid or cannot be processed.',
  NOT_FOUND: 'The requested resource could not be found.',
} satisfies Record<GenericErrorCodes, string>

export type GenericErrorKey = keyof typeof GENERIC_ERROR_MESSAGES

export function getGenericErrorMessage (code: GenericErrorKey) {
  if (code in GENERIC_ERROR_MESSAGES) {
    return GENERIC_ERROR_MESSAGES[code]
  }
  return GENERIC_ERROR_MESSAGES['UNKNOWN']
}

export const ERRORS = {
  AUTH: {
    ...AUTH_ERROR_MESSAGES
  },
  GENERIC: {
    ...GENERIC_ERROR_MESSAGES,
  },
  PROJECT: {
    ...PROJECT_ERROR_MESSAGES
  }
} as const satisfies Record<ErrorScopes, { [k:string]: string }>

export function getErrorMessage<Scope extends ErrorScopes = 'GENERIC'> (scope: Scope, code: GetAllKeys<typeof ERRORS[Scope]>) {
  if (ERRORS[scope][code]) {
    return ERRORS[scope][code]
  }

  return ERRORS['GENERIC']['UNKNOWN']
}

type GetAllKeys<T> = T extends T ? keyof T : never

type UnionErrorCodes = typeof ERRORS[ErrorScopes]
export type AvailableErrorCodes = GetAllKeys<UnionErrorCodes>
