import { AuthUser, RegisterInput, LoginInput } from '@/lib/types'

export type { AuthUser, RegisterInput, LoginInput }

export interface StoredUser extends AuthUser {
  passwordHash: string
}

export interface RegisterResult {
  success: true
  user: AuthUser
}

export interface RegisterError {
  success: false
  errors: Record<string, string[]>
}

export interface LoginResult {
  success: true
  user: AuthUser
  token: string
}

export interface LoginError {
  success: false
  error: string
  message: string
}

export interface VerifyTokenResult {
  success: true
  user: AuthUser
}

export interface VerifyTokenError {
  success: false
  error: string
  message: string
}

export type AuthRegisterResult = RegisterResult | RegisterError
export type AuthLoginResult = LoginResult | LoginError
export type AuthVerifyResult = VerifyTokenResult | VerifyTokenError
