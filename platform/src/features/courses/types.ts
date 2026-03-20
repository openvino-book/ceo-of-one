import { VALID_CATEGORIES } from '@/lib/config'

export type Category = (typeof VALID_CATEGORIES)[number]

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  price: number
  category: Category
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateCourseInput {
  title: string
  description?: string
  instructor: string
  price: number
  category: Category
  published?: boolean
}

export interface UpdateCourseInput {
  title?: string
  description?: string
  instructor?: string
  price?: number
  category?: Category
  published?: boolean
}

export interface CourseFilters {
  category?: Category
  published?: boolean
}

export {
  VALID_CATEGORIES,
}

export function isValidCategory(value: string): value is Category {
  return VALID_CATEGORIES.includes(value as Category)
}
