import { v4 as uuidv4 } from 'uuid'
import { PaymentOrder, PaymentStatus } from './types'

class PaymentStore {
  private orders: Map<string, PaymentOrder> = new Map()
  private enrollments: Map<string, Set<string>> = new Map()
  private seeded: boolean = false

  constructor() {
    this.seed()
  }

  private seed(): void {
    if (this.seeded) return
    this.seeded = true

    // Dynamic require to avoid circular dependency at module load time
    const { authStore } = require('../auth/store')
    const { courseStore } = require('../courses/store')

    const users = authStore.findAll()
    const courses = courseStore.findAll()

    if (users.length === 0 || courses.length === 0) return

    const demoOrders: Array<{ userIndex: number; courseIndex: number; amount: number; status: PaymentStatus; daysAgo: number }> = [
      { userIndex: 0, courseIndex: 0, amount: 199, status: 'completed', daysAgo: 7 },
      { userIndex: 1, courseIndex: 1, amount: 99, status: 'completed', daysAgo: 6 },
      { userIndex: 2, courseIndex: 2, amount: 149, status: 'completed', daysAgo: 5 },
      { userIndex: 3, courseIndex: 3, amount: 129, status: 'pending', daysAgo: 4 },
      { userIndex: 0, courseIndex: 4, amount: 299, status: 'completed', daysAgo: 3 },
      { userIndex: 1, courseIndex: 5, amount: 79, status: 'completed', daysAgo: 2 },
      { userIndex: 4, courseIndex: 0, amount: 199, status: 'pending', daysAgo: 1 },
      { userIndex: 2, courseIndex: 4, amount: 299, status: 'completed', daysAgo: 0 },
    ]

    for (const orderData of demoOrders) {
      const user = users[orderData.userIndex]
      const course = courses[orderData.courseIndex]
      if (!user || !course) continue

      const now = new Date()
      const createdAt = new Date(now.getTime() - orderData.daysAgo * 24 * 60 * 60 * 1000)

      const order: PaymentOrder = {
        id: uuidv4(),
        userId: user.id,
        courseId: course.id,
        amount: orderData.amount,
        status: orderData.status,
        createdAt,
        updatedAt: createdAt,
      }
      this.orders.set(order.id, order)

      if (orderData.status === 'completed') {
        this.enroll(user.id, course.id)
      }
    }
  }

  findAll(): PaymentOrder[] {
    return Array.from(this.orders.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  createOrder(
    userId: string,
    courseId: string,
    amount: number,
    status: PaymentStatus = 'pending'
  ): PaymentOrder {
    const now = new Date()
    const order: PaymentOrder = {
      id: uuidv4(),
      userId,
      courseId,
      amount,
      status,
      createdAt: now,
      updatedAt: now,
    }
    this.orders.set(order.id, order)
    return order
  }

  findOrderById(id: string): PaymentOrder | undefined {
    return this.orders.get(id)
  }

  findOrdersByUserId(userId: string): PaymentOrder[] {
    return Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  updateOrderStatus(id: string, status: PaymentStatus): PaymentOrder | undefined {
    const order = this.orders.get(id)
    if (!order) {
      return undefined
    }
    const updatedOrder: PaymentOrder = {
      ...order,
      status,
      updatedAt: new Date(),
    }
    this.orders.set(id, updatedOrder)
    return updatedOrder
  }

  isEnrolled(userId: string, courseId: string): boolean {
    const userEnrollments = this.enrollments.get(userId)
    return userEnrollments ? userEnrollments.has(courseId) : false
  }

  enroll(userId: string, courseId: string): void {
    if (!this.enrollments.has(userId)) {
      this.enrollments.set(userId, new Set())
    }
    this.enrollments.get(userId)!.add(courseId)
  }

  getEnrolledCourseIds(userId: string): string[] {
    const userEnrollments = this.enrollments.get(userId)
    return userEnrollments ? Array.from(userEnrollments) : []
  }

  clear(): void {
    this.orders.clear()
    this.enrollments.clear()
    this.seeded = false
  }
}

export const paymentStore = new PaymentStore()
