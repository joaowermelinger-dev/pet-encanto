// Endpoints públicos consumidos pela landing page (sem autenticação/CSRF).
import { apiRequest } from './client'
import type { PetPhoto, PublicService, ShopInfo } from '../types'

export function getPublicShopInfo(): Promise<ShopInfo | null> {
  return apiRequest<ShopInfo | null>('/public/shop-info')
}

export function getPublicServices(): Promise<PublicService[]> {
  return apiRequest<PublicService[]>('/public/services')
}

export function getPublicGallery(): Promise<PetPhoto[]> {
  return apiRequest<PetPhoto[]>('/public/gallery')
}
