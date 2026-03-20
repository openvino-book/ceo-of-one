import { getDashboardStats } from './service'
import { DashboardDeps } from './types'

describe('Dashboard Module', () => {
  const createMockDeps = (
    users: Array<{ id: string; name: string; email: string; createdAt: Date }> = [],
    courses: Array<{ id: string; title: string }> = [],
    orders: Array<{ id: string; courseId: string; userId: string; amount: number; status: string; createdAt: Date }> = []
  ): DashboardDeps => ({
    getUsers: () => users,
    getCourses: () => courses,
    getOrders: () => orders,
    getUserName: (userId: string) => users.find((u) => u.id === userId)?.name,
    getCourseName: (courseId: string) => courses.find((c) => c.id === courseId)?.title,
  })

  describe('getDashboardStats', () => {
    it('should return zero stats when no data exists', () => {
      const deps = createMockDeps()
      const stats = getDashboardStats(deps)

      expect(stats.totalUsers).toBe(0)
      expect(stats.totalCourses).toBe(0)
      expect(stats.totalOrders).toBe(0)
      expect(stats.completedOrders).toBe(0)
      expect(stats.totalRevenue).toBe(0)
      expect(stats.recentUsers).toHaveLength(0)
      expect(stats.recentOrders).toHaveLength(0)
    })

    it('should count total users correctly', () => {
      const users = [
        { id: '1', name: 'Alice', email: 'alice@test.com', createdAt: new Date() },
        { id: '2', name: 'Bob', email: 'bob@test.com', createdAt: new Date() },
        { id: '3', name: 'Carol', email: 'carol@test.com', createdAt: new Date() },
      ]
      const deps = createMockDeps(users)
      const stats = getDashboardStats(deps)

      expect(stats.totalUsers).toBe(3)
    })

    it('should count total courses correctly', () => {
      const courses = [
        { id: 'c1', title: 'Course 1' },
        { id: 'c2', title: 'Course 2' },
      ]
      const deps = createMockDeps([], courses)
      const stats = getDashboardStats(deps)

      expect(stats.totalCourses).toBe(2)
    })

    it('should count total orders correctly', () => {
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 100, status: 'completed', createdAt: new Date() },
        { id: 'o2', courseId: 'c2', userId: 'u2', amount: 200, status: 'pending', createdAt: new Date() },
        { id: 'o3', courseId: 'c1', userId: 'u3', amount: 150, status: 'completed', createdAt: new Date() },
      ]
      const deps = createMockDeps([], [], orders)
      const stats = getDashboardStats(deps)

      expect(stats.totalOrders).toBe(3)
    })

    it('should count only completed orders', () => {
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 100, status: 'completed', createdAt: new Date() },
        { id: 'o2', courseId: 'c2', userId: 'u2', amount: 200, status: 'pending', createdAt: new Date() },
        { id: 'o3', courseId: 'c1', userId: 'u3', amount: 150, status: 'completed', createdAt: new Date() },
        { id: 'o4', courseId: 'c2', userId: 'u4', amount: 250, status: 'failed', createdAt: new Date() },
      ]
      const deps = createMockDeps([], [], orders)
      const stats = getDashboardStats(deps)

      expect(stats.completedOrders).toBe(2)
    })

    it('should calculate total revenue from completed orders only', () => {
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 100, status: 'completed', createdAt: new Date() },
        { id: 'o2', courseId: 'c2', userId: 'u2', amount: 200, status: 'pending', createdAt: new Date() },
        { id: 'o3', courseId: 'c1', userId: 'u3', amount: 150, status: 'completed', createdAt: new Date() },
      ]
      const deps = createMockDeps([], [], orders)
      const stats = getDashboardStats(deps)

      expect(stats.totalRevenue).toBe(250)
    })

    it('should return zero revenue when no completed orders exist', () => {
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 100, status: 'pending', createdAt: new Date() },
        { id: 'o2', courseId: 'c2', userId: 'u2', amount: 200, status: 'failed', createdAt: new Date() },
      ]
      const deps = createMockDeps([], [], orders)
      const stats = getDashboardStats(deps)

      expect(stats.totalRevenue).toBe(0)
    })

    it('should return recent users sorted by createdAt descending', () => {
      const now = new Date()
      const users = [
        { id: '1', name: 'Alice', email: 'alice@test.com', createdAt: new Date(now.getTime() - 3000) },
        { id: '2', name: 'Bob', email: 'bob@test.com', createdAt: new Date(now.getTime() - 1000) },
        { id: '3', name: 'Carol', email: 'carol@test.com', createdAt: new Date(now.getTime() - 2000) },
      ]
      const deps = createMockDeps(users)
      const stats = getDashboardStats(deps)

      expect(stats.recentUsers).toHaveLength(3)
      expect(stats.recentUsers[0].name).toBe('Bob')
      expect(stats.recentUsers[1].name).toBe('Carol')
      expect(stats.recentUsers[2].name).toBe('Alice')
    })

    it('should limit recent users to 5', () => {
      const now = new Date()
      const users = Array.from({ length: 10 }, (_, i) => ({
        id: `u${i}`,
        name: `User ${i}`,
        email: `user${i}@test.com`,
        createdAt: new Date(now.getTime() - i * 1000),
      }))
      const deps = createMockDeps(users)
      const stats = getDashboardStats(deps)

      expect(stats.recentUsers).toHaveLength(5)
    })

    it('should include correct user data in recent users', () => {
      const users = [
        { id: '1', name: 'Alice Wang', email: 'alice@example.com', createdAt: new Date('2024-01-15') },
      ]
      const deps = createMockDeps(users)
      const stats = getDashboardStats(deps)

      expect(stats.recentUsers[0].name).toBe('Alice Wang')
      expect(stats.recentUsers[0].email).toBe('alice@example.com')
      expect(stats.recentUsers[0].createdAt).toBe('2024-01-15T00:00:00.000Z')
    })

    it('should return recent orders sorted by createdAt descending', () => {
      const now = new Date()
      const users = [{ id: 'u1', name: 'Alice', email: 'a@test.com', createdAt: now }]
      const courses = [{ id: 'c1', title: 'Course 1' }]
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 100, status: 'completed', createdAt: new Date(now.getTime() - 3000) },
        { id: 'o2', courseId: 'c1', userId: 'u1', amount: 200, status: 'completed', createdAt: new Date(now.getTime() - 1000) },
        { id: 'o3', courseId: 'c1', userId: 'u1', amount: 150, status: 'pending', createdAt: new Date(now.getTime() - 2000) },
      ]
      const deps = createMockDeps(users, courses, orders)
      const stats = getDashboardStats(deps)

      expect(stats.recentOrders).toHaveLength(3)
      expect(stats.recentOrders[0].id).toBe('o2')
      expect(stats.recentOrders[1].id).toBe('o3')
      expect(stats.recentOrders[2].id).toBe('o1')
    })

    it('should limit recent orders to 10', () => {
      const now = new Date()
      const users = [{ id: 'u1', name: 'Alice', email: 'a@test.com', createdAt: now }]
      const courses = [{ id: 'c1', title: 'Course 1' }]
      const orders = Array.from({ length: 15 }, (_, i) => ({
        id: `o${i}`,
        courseId: 'c1',
        userId: 'u1',
        amount: 100,
        status: 'completed',
        createdAt: new Date(now.getTime() - i * 1000),
      }))
      const deps = createMockDeps(users, courses, orders)
      const stats = getDashboardStats(deps)

      expect(stats.recentOrders).toHaveLength(10)
    })

    it('should include course name in recent orders', () => {
      const now = new Date()
      const users = [{ id: 'u1', name: 'Alice', email: 'a@test.com', createdAt: now }]
      const courses = [{ id: 'c1', title: 'AI Prompt Engineering' }]
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 199, status: 'completed', createdAt: now },
      ]
      const deps = createMockDeps(users, courses, orders)
      const stats = getDashboardStats(deps)

      expect(stats.recentOrders[0].courseName).toBe('AI Prompt Engineering')
    })

    it('should include user name in recent orders', () => {
      const now = new Date()
      const users = [{ id: 'u1', name: 'Bob Zhang', email: 'bob@test.com', createdAt: now }]
      const courses = [{ id: 'c1', title: 'Course 1' }]
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 99, status: 'completed', createdAt: now },
      ]
      const deps = createMockDeps(users, courses, orders)
      const stats = getDashboardStats(deps)

      expect(stats.recentOrders[0].userName).toBe('Bob Zhang')
    })

    it('should handle unknown course/user gracefully', () => {
      const now = new Date()
      const orders = [
        { id: 'o1', courseId: 'unknown', userId: 'unknown', amount: 100, status: 'completed', createdAt: now },
      ]
      const deps = createMockDeps([], [], orders)
      const stats = getDashboardStats(deps)

      expect(stats.recentOrders[0].courseName).toBe('Unknown Course')
      expect(stats.recentOrders[0].userName).toBe('Unknown User')
    })

    it('should include order status in recent orders', () => {
      const now = new Date()
      const users = [{ id: 'u1', name: 'Alice', email: 'a@test.com', createdAt: now }]
      const courses = [{ id: 'c1', title: 'Course 1' }]
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 99, status: 'pending', createdAt: now },
        { id: 'o2', courseId: 'c1', userId: 'u1', amount: 199, status: 'completed', createdAt: now },
      ]
      const deps = createMockDeps(users, courses, orders)
      const stats = getDashboardStats(deps)

      const pendingOrder = stats.recentOrders.find((o) => o.id === 'o1')
      const completedOrder = stats.recentOrders.find((o) => o.id === 'o2')

      expect(pendingOrder?.status).toBe('pending')
      expect(completedOrder?.status).toBe('completed')
    })

    it('should calculate revenue correctly with various order amounts', () => {
      const orders = [
        { id: 'o1', courseId: 'c1', userId: 'u1', amount: 199, status: 'completed', createdAt: new Date() },
        { id: 'o2', courseId: 'c1', userId: 'u2', amount: 99, status: 'completed', createdAt: new Date() },
        { id: 'o3', courseId: 'c1', userId: 'u3', amount: 299, status: 'completed', createdAt: new Date() },
        { id: 'o4', courseId: 'c1', userId: 'u4', amount: 149, status: 'completed', createdAt: new Date() },
      ]
      const deps = createMockDeps([], [], orders)
      const stats = getDashboardStats(deps)

      expect(stats.totalRevenue).toBe(746)
    })
  })
})
