import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as petPhotosApi from '../api/petPhotos'
import type { UpdatePhotoInput, UploadPhotoInput } from '../api/petPhotos'

const PET_PHOTOS = ['pet-photos'] as const
const PUBLIC_GALLERY = ['public', 'gallery'] as const

export function usePetPhotos() {
  return useQuery({ queryKey: PET_PHOTOS, queryFn: petPhotosApi.listPetPhotos })
}

export function useUploadPetPhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UploadPhotoInput) => petPhotosApi.uploadPetPhoto(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PET_PHOTOS })
      queryClient.invalidateQueries({ queryKey: PUBLIC_GALLERY })
    },
  })
}

export function useUpdatePetPhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdatePhotoInput }) => petPhotosApi.updatePetPhoto(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PET_PHOTOS })
      queryClient.invalidateQueries({ queryKey: PUBLIC_GALLERY })
    },
  })
}

export function useDeletePetPhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => petPhotosApi.deletePetPhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PET_PHOTOS })
      queryClient.invalidateQueries({ queryKey: PUBLIC_GALLERY })
    },
  })
}
