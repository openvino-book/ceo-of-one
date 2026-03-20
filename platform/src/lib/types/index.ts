export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
  message: string
  details?: Record<string, string[]>
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuthUser {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface JwtPayload {
  userId: string
  email: string
  iat: number
  exp: number
}
