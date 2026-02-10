export const GENERIC_ERROR_MESSAGES = {
  UNKNOWN: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  BAD_REQUEST: 'The request was invalid or cannot be processed.',
  NOT_FOUND: 'The requested resource could not be found.',
} satisfies Record<GenericErrorCodes, string>

export function getGenericErrorMessage (code: GenericErrorCodes) {
  if (code in GENERIC_ERROR_MESSAGES) {
    return GENERIC_ERROR_MESSAGES[code]
  }
  return GENERIC_ERROR_MESSAGES['UNKNOWN']
}
