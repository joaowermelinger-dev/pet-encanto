import { apiRequest } from './client'
import type { User } from '../types'

export function login(email: string, password: string): Promise<User> {
  return apiRequest<User>('/auth/login', { method: 'POST', body: { email, password } })
}

export function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' })
}

export function getCurrentUser(): Promise<User> {
  return apiRequest<User>('/auth/me')
}
