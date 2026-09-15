// Endpoints públicos consumidos pela landing page (sem autenticação/CSRF).
import { apiRequest } from './client'
import type { PetPhoto, ShopInfo } from '../types'

export function getPublicShopInfo(): Promise<ShopInfo | null> {
  return apiRequest<ShopInfo | null>('/public/shop-info')
}

export function getPublicGallery(): Promise<PetPhoto[]> {
  return apiRequest<PetPhoto[]>('/public/gallery')
}
