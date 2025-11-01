import type { PROJECT_ERROR_CODES } from '#shared/types/error'
import { GENERIC_ERROR_MESSAGES } from '.'

const PROJECT_ERROR_MESSAGES = {
  NAME_AND_CLIENT_NAME_ALREADY_EXISTS: 'A project with this name already exists for the client',
} satisfies Record<keyof PROJECT_ERROR_CODES, string>

export const getProjectErrorMessage = (code: string) => {
  if (code in PROJECT_ERROR_MESSAGES) {
    return PROJECT_ERROR_MESSAGES[code as keyof typeof PROJECT_ERROR_MESSAGES]
  }
  return GENERIC_ERROR_MESSAGES['UNKNOWN']
}
