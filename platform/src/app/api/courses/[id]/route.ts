import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse, notFoundResponse } from '@/lib/utils/api-response'
import { getCourse, updateCourse, deleteCourse } from '@/features/courses/service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const result = getCourse(id)

  if ('success' in result && !result.success) {
    return notFoundResponse('Course', id)
  }

  return successResponse(result)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const result = updateCourse(id, body)

    if ('success' in result && !result.success) {
      if ('error' in result && result.error === 'Not Found') {
        return notFoundResponse('Course', id)
      }
      if ('errors' in result) {
        return errorResponse('Validation Error', 'Invalid input data', result.errors, 400)
      }
    }

    if ('success' in result && result.success && 'course' in result) {
      return successResponse(result.course)
    }

    return successResponse(result)
  } catch {
    return errorResponse('Bad Request', 'Invalid JSON body', undefined, 400)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const result = deleteCourse(id)

  if (result !== true) {
    return notFoundResponse('Course', id)
  }

  return new NextResponse(null, { status: 204 })
}
