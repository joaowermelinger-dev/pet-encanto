import { apiRequest } from './client'
import type { Service } from '../types'

export interface ServiceInput {
  name: string
  description?: string | null
  duration_minutes: number
  price: number
  is_public: boolean
  is_active: boolean
}

export function listServices(): Promise<Service[]> {
  return apiRequest<Service[]>('/services')
}

export function createService(input: ServiceInput): Promise<Service> {
  return apiRequest<Service>('/services', { method: 'POST', body: input })
}

export function updateService(id: number, input: ServiceInput): Promise<Service> {
  return apiRequest<Service>(`/services/${id}`, { method: 'PATCH', body: input })
}

export function deleteService(id: number): Promise<void> {
  return apiRequest<void>(`/services/${id}`, { method: 'DELETE' })
}
