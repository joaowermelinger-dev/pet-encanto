import { apiRequest } from './client'
import type { Client, ClientWithPets } from '../types'

export interface ClientInput {
  name: string
  phone: string
  email?: string | null
  address?: string | null
  notes?: string | null
}

export function listClients(q?: string): Promise<Client[]> {
  return apiRequest<Client[]>('/clients', { query: { q } })
}

export function getClient(id: number): Promise<ClientWithPets> {
  return apiRequest<ClientWithPets>(`/clients/${id}`)
}

export function createClient(input: ClientInput): Promise<Client> {
  return apiRequest<Client>('/clients', { method: 'POST', body: input })
}

export function updateClient(id: number, input: ClientInput): Promise<Client> {
  return apiRequest<Client>(`/clients/${id}`, { method: 'PATCH', body: input })
}

export function deleteClient(id: number): Promise<void> {
  return apiRequest<void>(`/clients/${id}`, { method: 'DELETE' })
}
