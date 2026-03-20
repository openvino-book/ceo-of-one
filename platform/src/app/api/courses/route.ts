import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { listCourses, createCourse } from '@/features/courses/service'
import { isValidCategory } from '@/features/courses/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const published = searchParams.get('published')

  const filters = {
    ...(category && isValidCategory(category) && { category }),
    ...(published === 'true' && { published: true }),
    ...(published === 'false' && { published: false }),
  }

  const courses = listCourses(Object.keys(filters).length > 0 ? filters : undefined)
  return successResponse(courses)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = createCourse(body)

    if (!result.success) {
      return errorResponse('Validation Error', 'Invalid input data', result.errors, 400)
    }

    return successResponse(result.course, 201)
  } catch {
    return errorResponse('Bad Request', 'Invalid JSON body', undefined, 400)
  }
}
