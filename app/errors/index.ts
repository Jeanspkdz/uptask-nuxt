import { AUTH_ERROR_MESSAGES } from './auth'
import { GENERIC_ERROR_MESSAGES } from './generic'
import { PROJECT_ERROR_MESSAGES } from './project'

type GetAllKeys<T> = T extends T ? keyof T : never
type UnionErrorCodes = (typeof ERRORS)[ErrorScopes]
export type AvailableErrorCodes = GetAllKeys<UnionErrorCodes>

export const ERRORS = {
  AUTH: {
    ...AUTH_ERROR_MESSAGES,
  },
  GENERIC: {
    ...GENERIC_ERROR_MESSAGES,
  },
  PROJECT: {
    ...PROJECT_ERROR_MESSAGES,
  },
} as const satisfies Record<ErrorScopes, { [k: string]: string }>

export function getErrorMessage<Scope extends ErrorScopes = 'GENERIC'> (
  scope: Scope,
  code: GetAllKeys<(typeof ERRORS)[Scope]>
) {
  if (ERRORS[scope][code]) {
    return ERRORS[scope][code]
  }
  return ERRORS['GENERIC']['UNKNOWN']
}
