export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalOrders: number
  completedOrders: number
  totalRevenue: number
  recentUsers: Array<{
    name: string
    email: string
    createdAt: string
  }>
  recentOrders: Array<{
    id: string
    courseName: string
    userName: string
    amount: number
    status: string
    createdAt: string
  }>
}

export interface DashboardDeps {
  getUsers: () => Array<{
    id: string
    name: string
    email: string
    createdAt: Date
  }>
  getCourses: () => Array<{
    id: string
    title: string
  }>
  getOrders: () => Array<{
    id: string
    courseId: string
    userId: string
    amount: number
    status: string
    createdAt: Date
  }>
  getUserName: (userId: string) => string | undefined
  getCourseName: (courseId: string) => string | undefined
}
