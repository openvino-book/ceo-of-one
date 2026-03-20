import { NextResponse } from 'next/server'
import { ApiSuccess, ApiError } from '@/lib/types'

export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ success: true, data }, { status })
}

export function errorResponse(
  error: string,
  message: string,
  details?: Record<string, string[]>,
  status: number = 400
): NextResponse<ApiError> {
  const response: ApiError = {
    success: false,
    error,
    message,
  }
  if (details) {
    response.details = details
  }
  return NextResponse.json(response, { status })
}

export function notFoundResponse(
  resource: string,
  id: string
): NextResponse<ApiError> {
  return errorResponse('Not Found', `${resource} with ID ${id} not found`, undefined, 404)
}

export function validationErrorResponse(
  message: string,
  details: Record<string, string[]>
): NextResponse<ApiError> {
  return errorResponse('Validation Error', message, details, 400)
}
