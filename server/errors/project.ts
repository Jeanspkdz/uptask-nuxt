import type { ProjectErrorCodes } from '#shared/types/error'
import type { ErrorDetails } from '.'

type PROJECT_ERRORS = {
  [K in ProjectErrorCodes] : ErrorDetails<K>
}

export const PROJECT_ERRORS : PROJECT_ERRORS = {
  NAME_AND_CLIENT_NAME_ALREADY_EXISTS: {
    code: 'NAME_AND_CLIENT_NAME_ALREADY_EXISTS',
    message: 'Name and client name already exists'
  }
}
