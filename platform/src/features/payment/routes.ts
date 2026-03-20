import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookie } from '@/features/auth/routes'
import { getCurrentUser } from '@/features/auth/service'
import { createOrder, verifyPayment, getEnrollment } from './service'

export async function handleCheckout(request: NextRequest): Promise<NextResponse> {
  const token = getTokenFromCookie(request)
  const authResult = getCurrentUser(token)

  if (!authResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: authResult.message,
      },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const result = createOrder(authResult.user.id, body)

    if (!result.success) {
      const statusCode = result.error === 'Not Found' ? 404
        : result.error === 'Conflict' ? 409
        : result.error === 'Validation Error' ? 400
        : 400

      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: result.message,
        },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: result.order.id,
          amount: result.order.amount,
          courseName: result.courseName,
          status: result.order.status,
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Bad Request', message: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}

export async function handleVerify(request: NextRequest): Promise<NextResponse> {
  const token = getTokenFromCookie(request)
  const authResult = getCurrentUser(token)

  if (!authResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: authResult.message,
      },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const result = verifyPayment(authResult.user.id, body)

    if (!result.success) {
      const statusCode = result.error === 'Not Found' ? 404
        : result.error === 'Forbidden' ? 403
        : result.error === 'Conflict' ? 409
        : result.error === 'Validation Error' ? 400
        : 400

      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: result.message,
        },
        { status: statusCode }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          order: result.order,
          enrollment: result.enrollment,
        },
      },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Bad Request', message: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}

export async function handleGetEnrollment(request: NextRequest): Promise<NextResponse> {
  const token = getTokenFromCookie(request)
  const authResult = getCurrentUser(token)

  if (!authResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: authResult.message,
      },
      { status: 401 }
    )
  }

  const result = getEnrollment(authResult.user.id)

  if (result.success) {
    return NextResponse.json({
      success: true,
      data: result.enrolledCourses,
    })
  }

  return NextResponse.json(
    {
      success: false,
      error: result.error,
      message: result.message,
    },
    { status: 500 }
  )
}
