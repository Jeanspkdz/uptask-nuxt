import type { ErrorDetails } from '.'

export type ProjectErrors = {
  [K in ProjectErrorCodes]: ErrorDetails<K>;
}

export const PROJECT_ERRORS: ProjectErrors = {
  NAME_AND_CLIENT_NAME_ALREADY_EXISTS: {
    code: 'NAME_AND_CLIENT_NAME_ALREADY_EXISTS',
    message: 'Name and client name already exists',
    status: 400
  },
}
