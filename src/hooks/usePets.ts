import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as petsApi from '../api/pets'
import type { PetInput } from '../api/pets'

const PETS = ['pets'] as const
const CLIENTS = ['clients'] as const

export function usePets(clientId?: number) {
  return useQuery({ queryKey: [...PETS, clientId ?? 'all'], queryFn: () => petsApi.listPets(clientId) })
}

export function useCreatePet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: PetInput) => petsApi.createPet(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS })
      queryClient.invalidateQueries({ queryKey: CLIENTS })
    },
  })
}

export function useUpdatePet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Omit<PetInput, 'client_id'> }) =>
      petsApi.updatePet(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS })
      queryClient.invalidateQueries({ queryKey: CLIENTS })
    },
  })
}

export function useDeletePet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => petsApi.deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PETS })
      queryClient.invalidateQueries({ queryKey: CLIENTS })
    },
  })
}
