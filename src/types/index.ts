export type UserRole = 'owner'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
}

export type PetSpecies = 'dog' | 'cat' | 'other'
export type PetSize = 'small' | 'medium' | 'large'

export interface Pet {
  id: number
  client_id: number
  name: string
  species: PetSpecies
  breed: string | null
  size: PetSize | null
  birth_date: string | null
  notes: string | null
}

export interface Client {
  id: number
  name: string
  phone: string
  email: string | null
  address: string | null
  notes: string | null
}

export interface ClientWithPets extends Client {
  pets: Pet[]
}

export interface ShopInfo {
  shop_name: string
  address: string
  phone: string
  whatsapp: string | null
  email: string | null
  instagram_url: string | null
  opening_hours: string
  latitude: number | null
  longitude: number | null
}
