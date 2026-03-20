import { NextRequest } from 'next/server'
import { handleCheckout } from '@/features/payment/routes'

export async function POST(request: NextRequest) {
  return handleCheckout(request)
}
