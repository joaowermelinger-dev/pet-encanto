import { apiRequest, apiUpload } from './client'
import type { PetPhoto } from '../types'

export interface UploadPhotoInput {
  file: File
  caption?: string | null
  pet_id?: number | null
  is_public: boolean
}

export interface UpdatePhotoInput {
  pet_id?: number | null
  caption?: string | null
  is_public: boolean
}

export function listPetPhotos(): Promise<PetPhoto[]> {
  return apiRequest<PetPhoto[]>('/pet-photos')
}

export function uploadPetPhoto(input: UploadPhotoInput): Promise<PetPhoto> {
  const formData = new FormData()
  formData.set('file', input.file)
  if (input.caption) formData.set('caption', input.caption)
  if (input.pet_id != null) formData.set('pet_id', String(input.pet_id))
  formData.set('is_public', String(input.is_public))
  return apiUpload<PetPhoto>('/pet-photos', formData)
}

export function updatePetPhoto(id: number, input: UpdatePhotoInput): Promise<PetPhoto> {
  return apiRequest<PetPhoto>(`/pet-photos/${id}`, { method: 'PATCH', body: input })
}

export function deletePetPhoto(id: number): Promise<void> {
  return apiRequest<void>(`/pet-photos/${id}`, { method: 'DELETE' })
}
