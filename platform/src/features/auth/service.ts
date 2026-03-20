import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ValidationError, formatValidationErrors } from '@/lib/utils/validation'
import { AuthUser, RegisterInput, LoginInput, JwtPayload } from '@/lib/types'
import { authStore } from './store'
import {
  AuthRegisterResult,
  AuthLoginResult,
  AuthVerifyResult,
  StoredUser,
} from './types'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_EXPIRES_IN = '7d'
const BCRYPT_SALT_ROUNDS = 10

function validateEmail(email: unknown): ValidationError | null {
  if (email === undefined || email === null) {
    return { field: 'email', message: 'email is required' }
  }
  if (typeof email !== 'string') {
    return { field: 'email', message: 'email must be a string' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'email must be a valid email address' }
  }
  return null
}

function validatePassword(password: unknown): ValidationError | null {
  if (password === undefined || password === null) {
    return { field: 'password', message: 'password is required' }
  }
  if (typeof password !== 'string') {
    return { field: 'password', message: 'password must be a string' }
  }
  if (password.length < 8) {
    return { field: 'password', message: 'password must be at least 8 characters' }
  }
  return null
}

function validateName(name: unknown): ValidationError | null {
  if (name === undefined || name === null) {
    return { field: 'name', message: 'name is required' }
  }
  if (typeof name !== 'string') {
    return { field: 'name', message: 'name must be a string' }
  }
  if (name.trim() === '') {
    return { field: 'name', message: 'name must be a non-empty string' }
  }
  return null
}

export function validateRegisterInput(
  input: unknown
): { valid: true; data: RegisterInput } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (typeof input !== 'object' || input === null) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }],
    }
  }

  const body = input as Record<string, unknown>

  const nameError = validateName(body.name)
  if (nameError) errors.push(nameError)

  const emailError = validateEmail(body.email)
  if (emailError) errors.push(emailError)

  const passwordError = validatePassword(body.password)
  if (passwordError) errors.push(passwordError)

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    data: {
      name: body.name as string,
      email: body.email as string,
      password: body.password as string,
    },
  }
}

export function validateLoginInput(
  input: unknown
): { valid: true; data: LoginInput } | { valid: false; errors: ValidationError[] } {
  const errors: ValidationError[] = []

  if (typeof input !== 'object' || input === null) {
    return {
      valid: false,
      errors: [{ field: 'body', message: 'Request body must be a valid JSON object' }],
    }
  }

  const body = input as Record<string, unknown>

  const emailError = validateEmail(body.email)
  if (emailError) errors.push(emailError)

  const passwordError = validatePassword(body.password)
  if (passwordError) errors.push(passwordError)

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    data: {
      email: body.email as string,
      password: body.password as string,
    },
  }
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: AuthUser): string {
  const payload = {
    userId: user.id,
    email: user.email,
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

function storedUserToAuthUser(user: StoredUser): AuthUser {
  const { passwordHash: _, ...authUser } = user
  return authUser
}

export function register(input: unknown): AuthRegisterResult {
  const validation = validateRegisterInput(input)

  if (!validation.valid) {
    return {
      success: false,
      errors: formatValidationErrors(validation.errors),
    }
  }

  const { name, email, password } = validation.data

  if (authStore.emailExists(email)) {
    return {
      success: false,
      errors: { email: ['An account with this email already exists'] },
    }
  }

  const passwordHash = hashPasswordSync(password)
  const user = authStore.create(name, email, passwordHash)

  return { success: true, user }
}

function hashPasswordSync(password: string): string {
  return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS)
}

export async function login(input: unknown): Promise<AuthLoginResult> {
  const validation = validateLoginInput(input)

  if (!validation.valid) {
    return {
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
    }
  }

  const { email, password } = validation.data

  const user = authStore.findByEmail(email)
  if (!user) {
    return {
      success: false,
      error: 'Unauthorized',
      message: 'Invalid email or password',
    }
  }

  const passwordMatch = await comparePassword(password, user.passwordHash)
  if (!passwordMatch) {
    return {
      success: false,
      error: 'Unauthorized',
      message: 'Invalid email or password',
    }
  }

  const authUser = storedUserToAuthUser(user)
  const token = generateToken(authUser)

  return { success: true, user: authUser, token }
}

export function getCurrentUser(token: string | undefined): AuthVerifyResult {
  if (!token) {
    return {
      success: false,
      error: 'Unauthorized',
      message: 'No authentication token provided',
    }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return {
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    }
  }

  const user = authStore.findById(payload.userId)
  if (!user) {
    return {
      success: false,
      error: 'Unauthorized',
      message: 'User not found',
    }
  }

  return { success: true, user: storedUserToAuthUser(user) }
}

export {
  comparePassword as comparePasswordAsync,
}
