import { authStore } from './store'
import {
  validateRegisterInput,
  validateLoginInput,
  register,
  login,
  getCurrentUser,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
} from './service'
import { JwtPayload } from '@/lib/types'

describe('Auth Module', () => {
  beforeEach(() => {
    authStore.clear()
  })

  describe('AuthStore', () => {
    it('should create a user with hashed password', () => {
      const user = authStore.create('John Doe', 'john@example.com', 'hashedpassword123')

      expect(user.id).toBeDefined()
      expect(user.email).toBe('john@example.com')
      expect(user.name).toBe('John Doe')
      expect(user.createdAt).toBeInstanceOf(Date)
    })

    it('should find user by email (case-insensitive)', () => {
      authStore.create('John Doe', 'John@Example.com', 'hash')

      const found = authStore.findByEmail('john@example.com')
      expect(found).toBeDefined()
      expect(found?.name).toBe('John Doe')
    })

    it('should find user by id', () => {
      const created = authStore.create('Jane Doe', 'jane@example.com', 'hash')

      const found = authStore.findById(created.id)
      expect(found).toBeDefined()
      expect(found?.name).toBe('Jane Doe')
    })

    it('should check if email exists', () => {
      authStore.create('John', 'john@example.com', 'hash')

      expect(authStore.emailExists('john@example.com')).toBe(true)
      expect(authStore.emailExists('John@EXAMPLE.COM')).toBe(true)
      expect(authStore.emailExists('other@example.com')).toBe(false)
    })

    it('should return undefined for non-existent user', () => {
      expect(authStore.findById('non-existent')).toBeUndefined()
      expect(authStore.findByEmail('nonexistent@example.com')).toBeUndefined()
    })

    it('should clear all users', () => {
      authStore.create('User 1', 'user1@example.com', 'hash')
      authStore.create('User 2', 'user2@example.com', 'hash')

      authStore.clear()
      expect(authStore.emailExists('user1@example.com')).toBe(false)
      expect(authStore.emailExists('user2@example.com')).toBe(false)
    })
  })

  describe('validateRegisterInput', () => {
    it('should validate valid registration input', () => {
      const result = validateRegisterInput({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.password).toBe('password123')
      }
    })

    it('should fail when name is missing', () => {
      const result = validateRegisterInput({
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const nameErrors = result.errors.filter(e => e.field === 'name')
        expect(nameErrors.length).toBeGreaterThan(0)
        expect(nameErrors[0].message).toContain('required')
      }
    })

    it('should fail when name is empty', () => {
      const result = validateRegisterInput({
        name: '',
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const nameErrors = result.errors.filter(e => e.field === 'name')
        expect(nameErrors.length).toBeGreaterThan(0)
        expect(nameErrors[0].message).toContain('non-empty')
      }
    })

    it('should fail when email is invalid format', () => {
      const result = validateRegisterInput({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const emailErrors = result.errors.filter(e => e.field === 'email')
        expect(emailErrors.length).toBeGreaterThan(0)
        expect(emailErrors[0].message).toContain('valid email')
      }
    })

    it('should fail when password is less than 8 characters', () => {
      const result = validateRegisterInput({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'short',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const passwordErrors = result.errors.filter(e => e.field === 'password')
        expect(passwordErrors.length).toBeGreaterThan(0)
        expect(passwordErrors[0].message).toContain('8 characters')
      }
    })

    it('should return multiple validation errors', () => {
      const result = validateRegisterInput({
        name: '',
        email: 'invalid',
        password: 'short',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.errors.length).toBe(3)
      }
    })
  })

  describe('validateLoginInput', () => {
    it('should validate valid login input', () => {
      const result = validateLoginInput({
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result.valid).toBe(true)
      if (result.valid) {
        expect(result.data.email).toBe('john@example.com')
        expect(result.data.password).toBe('password123')
      }
    })

    it('should fail when email is invalid', () => {
      const result = validateLoginInput({
        email: 'invalid',
        password: 'password123',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const emailErrors = result.errors.filter(e => e.field === 'email')
        expect(emailErrors.length).toBeGreaterThan(0)
      }
    })

    it('should fail when password is too short', () => {
      const result = validateLoginInput({
        email: 'john@example.com',
        password: 'short',
      })

      expect(result.valid).toBe(false)
      if (!result.valid) {
        const passwordErrors = result.errors.filter(e => e.field === 'password')
        expect(passwordErrors.length).toBeGreaterThan(0)
      }
    })
  })

  describe('Password hashing', () => {
    it('should hash a password', async () => {
      const password = 'mypassword123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should compare password correctly', async () => {
      const password = 'mypassword123'
      const hash = await hashPassword(password)

      expect(await comparePassword(password, hash)).toBe(true)
      expect(await comparePassword('wrongpassword', hash)).toBe(false)
    })

    it('should generate different hashes for same password', async () => {
      const password = 'mypassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2)
      expect(await comparePassword(password, hash1)).toBe(true)
      expect(await comparePassword(password, hash2)).toBe(true)
    })
  })

  describe('JWT Token', () => {
    it('should generate a valid token', () => {
      const user = {
        id: 'user-123',
        email: 'john@example.com',
        name: 'John Doe',
        createdAt: new Date(),
      }

      const token = generateToken(user)
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3)
    })

    it('should verify a valid token', () => {
      const user = {
        id: 'user-123',
        email: 'john@example.com',
        name: 'John Doe',
        createdAt: new Date(),
      }

      const token = generateToken(user)
      const payload = verifyToken(token) as JwtPayload

      expect(payload).toBeDefined()
      expect(payload.userId).toBe('user-123')
      expect(payload.email).toBe('john@example.com')
      expect(payload.iat).toBeDefined()
      expect(payload.exp).toBeDefined()
    })

    it('should return null for invalid token', () => {
      const payload = verifyToken('invalid-token')
      expect(payload).toBeNull()
    })
  })

  describe('Register service', () => {
    it('should register a new user', () => {
      const result = register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.user.id).toBeDefined()
        expect(result.user.email).toBe('john@example.com')
        expect(result.user.name).toBe('John Doe')
      }
    })

    it('should return 409 for duplicate email', () => {
      register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })

      const result = register({
        name: 'Another John',
        email: 'john@example.com',
        password: 'different123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.email).toBeDefined()
        expect(result.errors.email[0]).toContain('already exists')
      }
    })

    it('should return validation errors for invalid input', () => {
      const result = register({
        name: '',
        email: 'invalid',
        password: 'short',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.errors.name).toBeDefined()
        expect(result.errors.email).toBeDefined()
        expect(result.errors.password).toBeDefined()
      }
    })
  })

  describe('Login service', () => {
    beforeEach(() => {
      register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })
    })

    it('should login with valid credentials', async () => {
      const result = await login({
        email: 'john@example.com',
        password: 'password123',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.user.email).toBe('john@example.com')
        expect(result.token).toBeDefined()
        expect(result.token.split('.').length).toBe(3)
      }
    })

    it('should fail with wrong password', async () => {
      const result = await login({
        email: 'john@example.com',
        password: 'wrongpassword',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Unauthorized')
        expect(result.message).toContain('Invalid email or password')
      }
    })

    it('should fail with non-existent email', async () => {
      const result = await login({
        email: 'nonexistent@example.com',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Unauthorized')
      }
    })

    it('should fail with invalid input', async () => {
      const result = await login({
        email: 'invalid',
        password: 'short',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Validation Error')
      }
    })
  })

  describe('getCurrentUser service', () => {
    let testToken: string

    beforeEach(() => {
      const result = register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      })
      if (result.success) {
        testToken = generateToken(result.user)
      }
    })

    it('should return user for valid token', () => {
      const result = getCurrentUser(testToken)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.user.email).toBe('john@example.com')
        expect(result.user.name).toBe('John Doe')
      }
    })

    it('should return 401 for no token', () => {
      const result = getCurrentUser(undefined)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Unauthorized')
        expect(result.message).toContain('No authentication token')
      }
    })

    it('should return 401 for invalid token', () => {
      const result = getCurrentUser('invalid-token')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Unauthorized')
        expect(result.message).toContain('Invalid or expired')
      }
    })
  })
})
