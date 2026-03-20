import { NextRequest } from 'next/server'
import { handleVerify } from '@/features/payment/routes'

export async function POST(request: NextRequest) {
  return handleVerify(request)
}
