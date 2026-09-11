import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as clientsApi from '../api/clients'
import type { ClientInput } from '../api/clients'

const CLIENTS = ['clients'] as const

export function useClients(q?: string) {
  return useQuery({ queryKey: [...CLIENTS, q ?? ''], queryFn: () => clientsApi.listClients(q) })
}

export function useClient(id: number) {
  return useQuery({ queryKey: [...CLIENTS, id], queryFn: () => clientsApi.getClient(id), enabled: !!id })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ClientInput) => clientsApi.createClient(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLIENTS }),
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ClientInput }) => clientsApi.updateClient(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLIENTS }),
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => clientsApi.deleteClient(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLIENTS }),
  })
}
