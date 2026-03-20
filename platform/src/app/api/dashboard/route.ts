import { NextRequest } from 'next/server'
import { handleGetDashboard } from '@/features/dashboard/routes'
import { authStore } from '@/features/auth/store'
import { courseStore } from '@/features/courses/store'
import { paymentStore } from '@/features/payment/store'

export async function GET(request: NextRequest) {
  return handleGetDashboard(request, {
    getUsers: () => authStore.findAll().map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
    })),
    getCourses: () => courseStore.findAll().map((c) => ({
      id: c.id,
      title: c.title,
    })),
    getOrders: () => paymentStore.findAll().map((o) => ({
      id: o.id,
      courseId: o.courseId,
      userId: o.userId,
      amount: o.amount,
      status: o.status,
      createdAt: o.createdAt,
    })),
    getUserName: (userId: string) => authStore.findById(userId)?.name,
    getCourseName: (courseId: string) => courseStore.findById(courseId)?.title,
  })
}
