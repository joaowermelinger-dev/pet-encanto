import { apiRequest } from './client'
import type { Pet, PetSize, PetSpecies } from '../types'

export interface PetInput {
  client_id: number
  name: string
  species: PetSpecies
  breed?: string | null
  size?: PetSize | null
  birth_date?: string | null
  notes?: string | null
}

export function listPets(clientId?: number): Promise<Pet[]> {
  return apiRequest<Pet[]>('/pets', { query: { client_id: clientId } })
}

export function createPet(input: PetInput): Promise<Pet> {
  return apiRequest<Pet>('/pets', { method: 'POST', body: input })
}

export function updatePet(id: number, input: Omit<PetInput, 'client_id'>): Promise<Pet> {
  return apiRequest<Pet>(`/pets/${id}`, { method: 'PATCH', body: input })
}

export function deletePet(id: number): Promise<void> {
  return apiRequest<void>(`/pets/${id}`, { method: 'DELETE' })
}
