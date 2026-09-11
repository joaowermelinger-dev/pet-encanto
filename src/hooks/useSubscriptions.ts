import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as subscriptionsApi from '../api/subscriptions'
import type { SubscriptionCreateInput } from '../api/subscriptions'
import type { SubscriptionStatus } from '../types'

const SUBSCRIPTIONS = ['subscriptions'] as const
const APPOINTMENTS = ['appointments'] as const

export function useSubscriptions() {
  return useQuery({ queryKey: SUBSCRIPTIONS, queryFn: subscriptionsApi.listSubscriptions })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SubscriptionCreateInput) => subscriptionsApi.createSubscription(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS })
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS })
    },
  })
}

export function useUpdateSubscriptionStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: SubscriptionStatus }) =>
      subscriptionsApi.updateSubscriptionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS })
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS })
    },
  })
}

export function useExtendSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => subscriptionsApi.extendSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS })
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS })
    },
  })
}
