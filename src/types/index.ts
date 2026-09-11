export type UserRole = 'owner'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
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
