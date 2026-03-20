import { NextRequest, NextResponse } from 'next/server'
import { register, login, getCurrentUser } from './service'

export const COOKIE_NAME = 'token'
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export function getTokenFromCookie(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_NAME)?.value
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  })
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
  })
}

export async function handleRegister(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const result = register(body)

    if (!result.success) {
      const isConflict = result.errors.email?.some((msg: string) =>
        msg.includes('already exists')
      )

      if (isConflict) {
        return NextResponse.json(
          {
            success: false,
            error: 'Conflict',
            message: 'An account with this email already exists',
            details: result.errors,
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Validation Error',
          message: 'Invalid input data',
          details: result.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, data: result.user },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: 'Bad Request', message: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}

export async function handleLogin(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const result = await login(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: result.message,
        },
        { status: 401 }
      )
    }

    const response = NextResponse.json(
      { success: true, data: { user: result.user, token: result.token } }
    )
    setAuthCookie(response, result.token)
    return response
  } catch {
    return NextResponse.json(
      { success: false, error: 'Bad Request', message: 'Invalid JSON body' },
      { status: 400 }
    )
  }
}

export async function handleGetCurrentUser(request: NextRequest): Promise<NextResponse> {
  const token = getTokenFromCookie(request)
  const result = getCurrentUser(token)

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        message: result.message,
      },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true, data: result.user })
}

export async function handleLogout(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
  clearAuthCookie(response)
  return response
}
