import { AUTH_ERROR_MESSAGES } from './auth'
import { GENERIC_ERROR_MESSAGES } from './generic'
import { PROJECT_ERROR_MESSAGES } from './project'

type ErrorMap = {
  [Scope in keyof ErrorScopesGroup]: {
    [K in ErrorScopesGroup[Scope]]: string;
  };
}

export const ERRORS: ErrorMap = {
  AUTH: {
    ...AUTH_ERROR_MESSAGES,
  },
  GENERIC: {
    ...GENERIC_ERROR_MESSAGES,
  },
  PROJECT: {
    ...PROJECT_ERROR_MESSAGES,
  },
}

export function getErrorMessage<
  Scope extends ErrorScopes,
  Code extends AllKeys<ErrorMap[Scope]>
> (scope: Scope, code: Code) {
  if (ERRORS[scope][code]) {
    return ERRORS[scope][code]
  }
  return ERRORS['GENERIC']['UNKNOWN']
}
