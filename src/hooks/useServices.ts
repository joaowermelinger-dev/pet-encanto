import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as servicesApi from '../api/services'
import type { ServiceInput } from '../api/services'

const SERVICES = ['services'] as const

export function useServices() {
  return useQuery({ queryKey: SERVICES, queryFn: servicesApi.listServices })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ServiceInput) => servicesApi.createService(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES }),
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ServiceInput }) => servicesApi.updateService(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES }),
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => servicesApi.deleteService(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SERVICES }),
  })
}
