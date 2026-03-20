export const APP_NAME = 'CEO of One Training Platform'

export const VALID_CATEGORIES = ['programming', 'design', 'business', 'marketing'] as const

export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const
