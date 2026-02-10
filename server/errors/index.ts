import type { ErrorScopes } from '~~/shared/types/error'
import { GENERIC_ERRORS } from './generic'
import { PROJECT_ERRORS } from './project'

export type ErrorData = ErrorDetails<ErrorCodes> & {
  reason?: string;
  scope: ErrorScopes;
}

export type ErrorDetails<T extends string = string> = {
  code: T;
  message: string;
  status: number
}

type AllKeys<T extends object> = T extends T ? keyof T : never

const ERRORS = {
  PROJECT: {
    ...PROJECT_ERRORS,
  },
  GENERIC: {
    ...GENERIC_ERRORS,
  },
} as const satisfies Record<Exclude<ErrorScopes, 'AUTH'>, Record<string, ErrorDetails>>

export const createCustomError = <Scope extends keyof typeof ERRORS>(
  scope: Scope,
  errCode: AllKeys<typeof ERRORS[Scope]>
) => {
  const error = ERRORS[scope][errCode] as ErrorDetails<typeof errCode>

  return createError<ErrorData>({
    status: error.status,
    statusText: error.code,
    data: {
      ...error,
      scope
    }
  })
}
