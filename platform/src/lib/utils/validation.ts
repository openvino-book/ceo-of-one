export interface ValidationError {
  field: string
  message: string
}

export function formatValidationErrors(
  errors: ValidationError[]
): Record<string, string[]> {
  const details: Record<string, string[]> = {}
  for (const error of errors) {
    if (!details[error.field]) {
      details[error.field] = []
    }
    details[error.field].push(error.message)
  }
  return details
}

export function validateRequiredString(
  value: unknown,
  field: string
): ValidationError | null {
  if (value === undefined || value === null) {
    return { field, message: `${field} is required` }
  }
  if (typeof value !== 'string') {
    return { field, message: `${field} must be a string` }
  }
  if (value.trim() === '') {
    return { field, message: `${field} must be a non-empty string` }
  }
  return null
}

export function validateOptionalString(
  value: unknown,
  field: string
): ValidationError | null {
  if (value === undefined || value === null) {
    return null
  }
  if (typeof value !== 'string') {
    return { field, message: `${field} must be a string` }
  }
  return null
}

export function validateRequiredNumber(
  value: unknown,
  field: string,
  min?: number
): ValidationError | null {
  if (value === undefined || value === null) {
    return { field, message: `${field} is required` }
  }
  if (typeof value !== 'number') {
    return { field, message: `${field} must be a number` }
  }
  if (min !== undefined && value < min) {
    return { field, message: `${field} must be greater than or equal to ${min}` }
  }
  return null
}

export function validateOptionalNumber(
  value: unknown,
  field: string,
  min?: number
): ValidationError | null {
  if (value === undefined || value === null) {
    return null
  }
  if (typeof value !== 'number') {
    return { field, message: `${field} must be a number` }
  }
  if (min !== undefined && value < min) {
    return { field, message: `${field} must be greater than or equal to ${min}` }
  }
  return null
}

export function validateEnum<T extends string>(
  value: unknown,
  field: string,
  validValues: T[]
): ValidationError | null {
  if (value === undefined || value === null) {
    return { field, message: `${field} is required` }
  }
  if (typeof value !== 'string') {
    return { field, message: `${field} must be a string` }
  }
  if (!validValues.includes(value as T)) {
    return { field, message: `${field} must be one of: ${validValues.join(', ')}` }
  }
  return null
}

export function validateOptionalEnum<T extends string>(
  value: unknown,
  field: string,
  validValues: T[]
): ValidationError | null {
  if (value === undefined || value === null) {
    return null
  }
  if (typeof value !== 'string') {
    return { field, message: `${field} must be a string` }
  }
  if (!validValues.includes(value as T)) {
    return { field, message: `${field} must be one of: ${validValues.join(', ')}` }
  }
  return null
}

export function validateOptionalBoolean(
  value: unknown,
  field: string
): ValidationError | null {
  if (value === undefined || value === null) {
    return null
  }
  if (typeof value !== 'boolean') {
    return { field, message: `${field} must be a boolean` }
  }
  return null
}
