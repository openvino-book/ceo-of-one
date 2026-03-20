import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/utils/api-response'
import { getDashboardStats } from './service'
import { DashboardDeps } from './types'

export function handleGetDashboard(
  request: NextRequest,
  deps: DashboardDeps
) {
  try {
    const stats = getDashboardStats(deps)
    return successResponse(stats)
  } catch (error) {
    return errorResponse(
      'Internal Server Error',
      'Failed to fetch dashboard stats',
      undefined,
      500
    )
  }
}
