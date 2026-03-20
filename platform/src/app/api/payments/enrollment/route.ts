import { NextRequest } from 'next/server'
import { handleGetEnrollment } from '@/features/payment/routes'

export async function GET(request: NextRequest) {
  return handleGetEnrollment(request)
}
