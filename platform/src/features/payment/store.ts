import { v4 as uuidv4 } from 'uuid'
import { PaymentOrder, PaymentStatus } from './types'

class PaymentStore {
  private orders: Map<string, PaymentOrder> = new Map()
  private enrollments: Map<string, Set<string>> = new Map()

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
  }
}

export const paymentStore = new PaymentStore()
