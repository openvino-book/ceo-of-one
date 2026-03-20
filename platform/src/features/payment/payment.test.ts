import { paymentStore } from './store'
import { courseStore } from '@/features/courses/store'
import { authStore } from '@/features/auth/store'
import {
  validateCheckoutInput,
  validateVerifyInput,
  createOrder,
  verifyPayment,
  getEnrollment,
} from './service'

describe('Payment Module', () => {
  let testUserId: string
  let testCourseId: string

  beforeEach(() => {
    paymentStore.clear()
    courseStore.clear()
    authStore.clear()

    const user = authStore.create('Test User', 'test@example.com', 'hashedpassword')
    testUserId = user.id

    const course = courseStore.create({
      title: 'Test Course',
      description: 'A test course',
      instructor: 'Test Instructor',
      price: 99.00,
      category: 'productivity',
      published: true,
    })
    testCourseId = course.id
  })

  describe('PaymentStore', () => {
    it('should create an order with pending status', () => {
      const order = paymentStore.createOrder(testUserId, testCourseId, 99.00)

      expect(order.id).toBeDefined()
      expect(order.userId).toBe(testUserId)
      expect(order.courseId).toBe(testCourseId)
      expect(order.amount).toBe(99.00)
      expect(order.status).toBe('pending')
      expect(order.createdAt).toBeInstanceOf(Date)
    })

    it('should find order by id', () => {
      const created = paymentStore.createOrder(testUserId, testCourseId, 99.00)
      const found = paymentStore.findOrderById(created.id)

      expect(found).toBeDefined()
      expect(found?.id).toBe(created.id)
    })

    it('should return undefined for non-existent order', () => {
      const found = paymentStore.findOrderById('non-existent-id')
      expect(found).toBeUndefined()
    })

    it('should find orders by user id', () => {
      paymentStore.createOrder(testUserId, testCourseId, 99.00)

      const anotherCourse = courseStore.create({
        title: 'Another Course',
        instructor: 'Another Instructor',
        price: 149.00,
        category: 'leadership',
      })
      paymentStore.createOrder(testUserId, anotherCourse.id, 149.00)

      const orders = paymentStore.findOrdersByUserId(testUserId)
      expect(orders.length).toBe(2)
    })

    it('should update order status', () => {
      const order = paymentStore.createOrder(testUserId, testCourseId, 99.00)
      const updated = paymentStore.updateOrderStatus(order.id, 'completed')

      expect(updated).toBeDefined()
      expect(updated?.status).toBe('completed')
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(order.createdAt.getTime())
    })

    it('should track enrollments', () => {
      expect(paymentStore.isEnrolled(testUserId, testCourseId)).toBe(false)

      paymentStore.enroll(testUserId, testCourseId)

      expect(paymentStore.isEnrolled(testUserId, testCourseId)).toBe(true)
    })

    it('should get enrolled course ids', () => {
      const anotherCourse = courseStore.create({
        title: 'Another Course',
        instructor: 'Another Instructor',
        price: 149.00,
        category: 'leadership',
      })

      paymentStore.enroll(testUserId, testCourseId)
      paymentStore.enroll(testUserId, anotherCourse.id)

      const enrolledIds = paymentStore.getEnrolledCourseIds(testUserId)
      expect(enrolledIds.length).toBe(2)
      expect(enrolledIds).toContain(testCourseId)
      expect(enrolledIds).toContain(anotherCourse.id)
    })

    it('should return empty array for user with no enrollments', () => {
      const enrolledIds = paymentStore.getEnrolledCourseIds('non-existent-user')
      expect(enrolledIds).toEqual([])
    })

    it('should clear all orders and enrollments', () => {
      paymentStore.createOrder(testUserId, testCourseId, 99.00)
      paymentStore.enroll(testUserId, testCourseId)

      paymentStore.clear()

      expect(paymentStore.findOrdersByUserId(testUserId).length).toBe(0)
      expect(paymentStore.isEnrolled(testUserId, testCourseId)).toBe(false)
    })
  })

  describe('validateCheckoutInput', () => {
    it('should validate valid checkout input', () => {
      const result = validateCheckoutInput({ courseId: testCourseId })

      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(result.data.courseId).toBe(testCourseId)
      }
    })

    it('should fail when courseId is missing', () => {
      const result = validateCheckoutInput({})

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.message).toContain('courseId is required')
      }
    })

    it('should fail when courseId is not a string', () => {
      const result = validateCheckoutInput({ courseId: 123 })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.message).toContain('courseId must be a string')
      }
    })

    it('should fail when courseId is empty', () => {
      const result = validateCheckoutInput({ courseId: '' })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.message).toContain('non-empty string')
      }
    })

    it('should fail when body is not an object', () => {
      const result = validateCheckoutInput('invalid')

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toBe('Bad Request')
      }
    })
  })

  describe('validateVerifyInput', () => {
    it('should validate valid verify input', () => {
      const order = paymentStore.createOrder(testUserId, testCourseId, 99.00)
      const result = validateVerifyInput({ orderId: order.id })

      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(result.data.orderId).toBe(order.id)
      }
    })

    it('should fail when orderId is missing', () => {
      const result = validateVerifyInput({})

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.message).toContain('orderId is required')
      }
    })

    it('should fail when orderId is not a string', () => {
      const result = validateVerifyInput({ orderId: 123 })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.message).toContain('orderId must be a string')
      }
    })
  })

  describe('createOrder service', () => {
    it('should create an order successfully', () => {
      const result = createOrder(testUserId, { courseId: testCourseId })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.order.userId).toBe(testUserId)
        expect(result.order.courseId).toBe(testCourseId)
        expect(result.order.status).toBe('pending')
        expect(result.courseName).toBe('Test Course')
      }
    })

    it('should return 404 for non-existent course', () => {
      const result = createOrder(testUserId, { courseId: 'non-existent-course' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Not Found')
        expect(result.message).toContain('Course with ID')
      }
    })

    it('should return 409 if already enrolled', () => {
      paymentStore.enroll(testUserId, testCourseId)

      const result = createOrder(testUserId, { courseId: testCourseId })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Conflict')
        expect(result.message).toContain('already enrolled')
      }
    })

    it('should return validation error for invalid input', () => {
      const result = createOrder(testUserId, { courseId: '' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Validation Error')
      }
    })
  })

  describe('verifyPayment service', () => {
    it('should verify payment and create enrollment', () => {
      const order = paymentStore.createOrder(testUserId, testCourseId, 99.00)
      const result = verifyPayment(testUserId, { orderId: order.id })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.order.status).toBe('completed')
        expect(result.enrollment.userId).toBe(testUserId)
        expect(result.enrollment.courseId).toBe(testCourseId)
        expect(paymentStore.isEnrolled(testUserId, testCourseId)).toBe(true)
      }
    })

    it('should return 404 for non-existent order', () => {
      const result = verifyPayment(testUserId, { orderId: 'non-existent-order' })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Not Found')
      }
    })

    it('should return 403 when verifying another user order', () => {
      const anotherUser = authStore.create('Another User', 'another@example.com', 'hash')
      const order = paymentStore.createOrder(anotherUser.id, testCourseId, 99.00)

      const result = verifyPayment(testUserId, { orderId: order.id })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Forbidden')
      }
    })

    it('should return 409 when order is not pending', () => {
      const order = paymentStore.createOrder(testUserId, testCourseId, 99.00)
      paymentStore.updateOrderStatus(order.id, 'completed')

      const result = verifyPayment(testUserId, { orderId: order.id })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Conflict')
        expect(result.message).toContain('already has status')
      }
    })
  })

  describe('getEnrollment service', () => {
    it('should return empty array when no enrollments', () => {
      const result = getEnrollment(testUserId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.enrolledCourses).toEqual([])
      }
    })

    it('should return enrolled courses with full details', () => {
      paymentStore.enroll(testUserId, testCourseId)

      const result = getEnrollment(testUserId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.enrolledCourses.length).toBe(1)
        expect(result.enrolledCourses[0].courseId).toBe(testCourseId)
        expect(result.enrolledCourses[0].courseDetails.title).toBe('Test Course')
        expect(result.enrolledCourses[0].courseDetails.instructor).toBe('Test Instructor')
        expect(result.enrolledCourses[0].courseDetails.price).toBe(99.00)
      }
    })

    it('should return multiple enrolled courses', () => {
      const anotherCourse = courseStore.create({
        title: 'Another Course',
        description: 'Another test course',
        instructor: 'Another Instructor',
        price: 149.00,
        category: 'leadership',
      })

      paymentStore.enroll(testUserId, testCourseId)
      paymentStore.enroll(testUserId, anotherCourse.id)

      const result = getEnrollment(testUserId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.enrolledCourses.length).toBe(2)
      }
    })

    it('should filter out courses that no longer exist', () => {
      const deletedCourse = courseStore.create({
        title: 'Deleted Course',
        instructor: 'Instructor',
        price: 50.00,
        category: 'productivity',
      })
      paymentStore.enroll(testUserId, deletedCourse.id)
      courseStore.delete(deletedCourse.id)

      const result = getEnrollment(testUserId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.enrolledCourses.length).toBe(0)
      }
    })
  })
})
