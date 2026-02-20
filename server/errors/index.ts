import type { ErrorCodes, ErrorScopes } from '~~/shared/types/error'
import { AUTH_ERRORS } from './auth'
import { GENERIC_ERRORS } from './generic'
import { PROJECT_ERRORS } from './project'

export type ErrorData = ErrorDetails<ErrorCodes> & {
  reason?: string;
  scope: ErrorScopes;
}

export type ErrorDetails<T extends ErrorCodes> = {
  code: T;
  message: string;
  status: number;
}

type ErrorMap = {
  [Scope in keyof ErrorScopesGroup]: {
    [Code in ErrorScopesGroup[Scope]]: ErrorDetails<Code>
  }
}

const ERRORS: ErrorMap = {
  PROJECT: {
    ...PROJECT_ERRORS,
  },
  GENERIC: {
    ...GENERIC_ERRORS,
  },
  AUTH: {
    ...AUTH_ERRORS,
  },
}

export const createCustomError = <
  Scope extends keyof ErrorMap,
  Code extends AllKeys<ErrorMap[Scope]>
>(
    scope: Scope,
    errCode: Code
  ) => {
  const error = ERRORS[scope][errCode]

  return createError<ErrorData>({
    status: error.status,
    statusText: error.code,
    data: {
      ...error,
      scope,
    },
  })
}
