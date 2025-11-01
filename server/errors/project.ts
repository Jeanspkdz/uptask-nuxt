import type { PROJECT_ERROR_CODES } from '#shared/types/error'

type PROJECT_ERRORS = {
  [K in keyof PROJECT_ERROR_CODES] : {
    code: K,
    message: string
  }
}
export const PROJECT_ERRORS : PROJECT_ERRORS = {
  NAME_AND_CLIENT_NAME_ALREADY_EXISTS: {
    code: 'NAME_AND_CLIENT_NAME_ALREADY_EXISTS',
    message: 'Name and client name already exists'
  },
  UNKNOWN_ERROR: {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred'
  }
}
