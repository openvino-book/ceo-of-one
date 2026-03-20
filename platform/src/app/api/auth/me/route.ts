import { NextRequest } from 'next/server'
import { handleGetCurrentUser } from '@/features/auth/routes'

export async function GET(request: NextRequest) {
  return handleGetCurrentUser(request)
}
