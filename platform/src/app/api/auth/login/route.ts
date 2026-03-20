import { NextRequest } from 'next/server'
import { handleLogin } from '@/features/auth/routes'

export async function POST(request: NextRequest) {
  return handleLogin(request)
}
