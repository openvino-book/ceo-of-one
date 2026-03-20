import { handleLogout } from '@/features/auth/routes'

export async function POST() {
  return handleLogout()
}
