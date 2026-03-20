import { DashboardStats, DashboardDeps } from './types'

export function getDashboardStats(deps: DashboardDeps): DashboardStats {
  const users = deps.getUsers()
  const courses = deps.getCourses()
  const orders = deps.getOrders()

  const completedOrders = orders.filter((order) => order.status === 'completed')
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0)

  const sortedUsers = [...users].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )
  const recentUsers = sortedUsers.slice(0, 5).map((user) => ({
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }))

  const sortedOrders = [...orders].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )
  const recentOrders = sortedOrders.slice(0, 10).map((order) => ({
    id: order.id,
    courseName: deps.getCourseName(order.courseId) ?? 'Unknown Course',
    userName: deps.getUserName(order.userId) ?? 'Unknown User',
    amount: order.amount,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  }))

  return {
    totalUsers: users.length,
    totalCourses: courses.length,
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    totalRevenue,
    recentUsers,
    recentOrders,
  }
}
