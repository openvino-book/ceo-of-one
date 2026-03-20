import { NextRequest } from 'next/server'
import { handleRegister } from '@/features/auth/routes'

export async function POST(request: NextRequest) {
  return handleRegister(request)
}
