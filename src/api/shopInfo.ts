import { apiRequest } from './client'
import type { ShopInfo } from '../types'

export interface ShopInfoInput {
  shop_name: string
  address: string
  phone: string
  whatsapp?: string | null
  email?: string | null
  instagram_url?: string | null
  opening_hours: string
  latitude?: number | null
  longitude?: number | null
}

export function getShopInfo(): Promise<ShopInfo> {
  return apiRequest<ShopInfo>('/shop-info')
}

export function updateShopInfo(input: ShopInfoInput): Promise<ShopInfo> {
  return apiRequest<ShopInfo>('/shop-info', { method: 'PATCH', body: input })
}
