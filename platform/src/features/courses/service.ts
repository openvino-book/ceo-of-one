import { ValidationError, formatValidationErrors } from '@/lib/utils/validation'
import {
  Course,
  CreateCourseInput,
  UpdateCourseInput,
  CourseFilters,
  Category,
  VALID_CATEGORIES,
  isValidCategory,
} from './types'
import { courseStore } from './store'

export interface CreateCourseResult {
  success: true
  course: Course
}

export interface CreateCourseError {
  success: false
  errors: Record<string, string[]>
}

export interface UpdateCourseResult {
  success: true
  course: Course
}

export interface UpdateCourseError {
  success: false
  errors: Record<string, string[]>
}

export interface ServiceError {
  success: false
  error: string
  message: string
}

export type GetCourseResult = Course | ServiceError
export type CreateResult = CreateCourseResult | CreateCourseError
export type UpdateResult = UpdateCourseResult | UpdateCourseError | ServiceError
export type DeleteResult = true | ServiceError

export function validateCreateCourse(
  input: unknown
): { valid: true; data: CreateCourseInput } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (typeof input !== 'object' || input === null) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }],
    }
  }

  const body = input as Record<string, unknown>

  if (body.title === undefined || body.title === null) {
    errors.push({ field: 'title', message: 'title is required' })
  } else if (typeof body.title !== 'string') {
    errors.push({ field: 'title', message: 'title must be a string' })
  } else if (body.title.trim() === '') {
    errors.push({ field: 'title', message: 'title must be a non-empty string' })
  }

  if (body.instructor === undefined || body.instructor === null) {
    errors.push({ field: 'instructor', message: 'instructor is required' })
  } else if (typeof body.instructor !== 'string') {
    errors.push({ field: 'instructor', message: 'instructor must be a string' })
  } else if (body.instructor.trim() === '') {
    errors.push({ field: 'instructor', message: 'instructor must be a non-empty string' })
  }

  if (body.price === undefined || body.price === null) {
    errors.push({ field: 'price', message: 'price is required' })
  } else if (typeof body.price !== 'number') {
    errors.push({ field: 'price', message: 'price must be a number' })
  } else if (body.price < 0) {
    errors.push({ field: 'price', message: 'price must be greater than or equal to 0' })
  }

  if (body.category === undefined || body.category === null) {
    errors.push({ field: 'category', message: 'category is required' })
  } else if (typeof body.category !== 'string') {
    errors.push({ field: 'category', message: 'category must be a string' })
  } else if (!isValidCategory(body.category)) {
    errors.push({
      field: 'category',
      message: `category must be one of: ${VALID_CATEGORIES.join(', ')}`,
    })
  }

  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    errors.push({ field: 'description', message: 'description must be a string' })
  }

  if (body.published !== undefined && body.published !== null && typeof body.published !== 'boolean') {
    errors.push({ field: 'published', message: 'published must be a boolean' })
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    data: {
      title: body.title as string,
      description: body.description as string | undefined,
      instructor: body.instructor as string,
      price: body.price as number,
      category: body.category as Category,
      published: body.published as boolean | undefined,
    },
  }
}

export function validateUpdateCourse(
  input: unknown
): { valid: true; data: UpdateCourseInput } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (typeof input !== 'object' || input === null) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }],
    }
  }

  const body = input as Record<string, unknown>
  const data: UpdateCourseInput = {}

  if (body.title !== undefined) {
    if (typeof body.title !== 'string') {
      errors.push({ field: 'title', message: 'title must be a string' })
    } else if (body.title.trim() === '') {
      errors.push({ field: 'title', message: 'title must be a non-empty string' })
    } else {
      data.title = body.title
    }
  }

  if (body.instructor !== undefined) {
    if (typeof body.instructor !== 'string') {
      errors.push({ field: 'instructor', message: 'instructor must be a string' })
    } else if (body.instructor.trim() === '') {
      errors.push({ field: 'instructor', message: 'instructor must be a non-empty string' })
    } else {
      data.instructor = body.instructor
    }
  }

  if (body.price !== undefined) {
    if (typeof body.price !== 'number') {
      errors.push({ field: 'price', message: 'price must be a number' })
    } else if (body.price < 0) {
      errors.push({ field: 'price', message: 'price must be greater than or equal to 0' })
    } else {
      data.price = body.price
    }
  }

  if (body.category !== undefined) {
    if (typeof body.category !== 'string') {
      errors.push({ field: 'category', message: 'category must be a string' })
    } else if (!isValidCategory(body.category)) {
      errors.push({
        field: 'category',
        message: `category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      })
    } else {
      data.category = body.category as Category
    }
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      errors.push({ field: 'description', message: 'description must be a string' })
    } else {
      data.description = body.description
    }
  }

  if (body.published !== undefined) {
    if (typeof body.published !== 'boolean') {
      errors.push({ field: 'published', message: 'published must be a boolean' })
    } else {
      data.published = body.published
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return { valid: true, data }
}

export function listCourses(filters?: CourseFilters): Course[] {
  return courseStore.findAll(filters)
}

export function getCourse(id: string): GetCourseResult {
  const course = courseStore.findById(id)
  if (!course) {
    return {
      success: false,
      error: 'Not Found',
      message: `Course with ID ${id} not found`,
    }
  }
  return course
}

export function createCourse(input: unknown): CreateResult {
  const validation = validateCreateCourse(input)

  if (!validation.valid) {
    return {
      success: false,
      errors: formatValidationErrors(validation.errors),
    }
  }

  const course = courseStore.create(validation.data)
  return { success: true, course }
}

export function updateCourse(id: string, input: unknown): UpdateResult {
  const existingCourse = courseStore.findById(id)
  if (!existingCourse) {
    return {
      success: false,
      error: 'Not Found',
      message: `Course with ID ${id} not found`,
    }
  }

  const validation = validateUpdateCourse(input)
  if (!validation.valid) {
    return {
      success: false,
      errors: formatValidationErrors(validation.errors),
    }
  }

  const updatedCourse = courseStore.update(id, validation.data)
  return { success: true, course: updatedCourse! }
}

export function deleteCourse(id: string): DeleteResult {
  const deleted = courseStore.delete(id)
  if (!deleted) {
    return {
      success: false,
      error: 'Not Found',
      message: `Course with ID ${id} not found`,
    }
  }
  return true
}
