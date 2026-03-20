import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { AuthUser } from '@/lib/types'
import { StoredUser } from './types'

class AuthStore {
  private users: Map<string, StoredUser> = new Map()
  private emailIndex: Map<string, string> = new Map()
  private seeded: boolean = false

  constructor() {
    this.seed()
  }

  private seed(): void {
    if (this.seeded) return
    this.seeded = true

    const passwordHash = bcrypt.hashSync('demo123456', 10)

    const demoUsers = [
      { name: 'Alice Wang', email: 'alice@example.com' },
      { name: 'Bob Zhang', email: 'bob@example.com' },
      { name: 'Carol Li', email: 'carol@example.com' },
      { name: 'David Chen', email: 'david@example.com' },
      { name: 'Eve Liu', email: 'eve@example.com' },
    ]

    for (const userData of demoUsers) {
      const now = new Date()
      const id = uuidv4()
      const user: StoredUser = {
        id,
        email: userData.email.toLowerCase(),
        name: userData.name,
        passwordHash,
        createdAt: now,
        enrolledCourses: [],
      }
      this.users.set(id, user)
      this.emailIndex.set(userData.email.toLowerCase(), id)
    }
  }

  create(name: string, email: string, passwordHash: string): AuthUser {
    const now = new Date()
    const id = uuidv4()

    const user: StoredUser = {
      id,
      email: email.toLowerCase(),
      name,
      passwordHash,
      createdAt: now,
      enrolledCourses: [],
    }

    this.users.set(id, user)
    this.emailIndex.set(email.toLowerCase(), id)

    const { passwordHash: _, ...authUser } = user
    return authUser
  }

  findById(id: string): StoredUser | undefined {
    return this.users.get(id)
  }

  findByEmail(email: string): StoredUser | undefined {
    const id = this.emailIndex.get(email.toLowerCase())
    if (!id) return undefined
    return this.users.get(id)
  }

  emailExists(email: string): boolean {
    return this.emailIndex.has(email.toLowerCase())
  }

  findAll(): StoredUser[] {
    return Array.from(this.users.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  clear(): void {
    this.users.clear()
    this.emailIndex.clear()
    this.seeded = false
  }
}

export const authStore = new AuthStore()
