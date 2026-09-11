// Endpoints públicos consumidos pela landing page (sem autenticação/CSRF).
import { apiRequest } from './client'
import type { ShopInfo } from '../types'

export function getPublicShopInfo(): Promise<ShopInfo | null> {
  return apiRequest<ShopInfo | null>('/public/shop-info')
}
