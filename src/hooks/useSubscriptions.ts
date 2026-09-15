import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as subscriptionsApi from '../api/subscriptions'
import type { SubscriptionCreateInput } from '../api/subscriptions'
import type { SubscriptionStatus } from '../types'

const SUBSCRIPTIONS = ['subscriptions'] as const
const APPOINTMENTS = ['appointments'] as const
const FINANCE = ['finance'] as const

export function useSubscriptions() {
  return useQuery({ queryKey: SUBSCRIPTIONS, queryFn: subscriptionsApi.listSubscriptions })
}

// Gerar/cancelar ocorrências cria ou muda `Appointment`s, o que também afeta
// o Financeiro (receita a receber) — sem invalidar essa query, a tela fica
// desatualizada até navegar pra outro lugar e voltar.
export function useCreateSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SubscriptionCreateInput) => subscriptionsApi.createSubscription(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTIONS })
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS })
      queryClient.invalidateQueries({ queryKey: FINANCE })
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
      queryClient.invalidateQueries({ queryKey: FINANCE })
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
      queryClient.invalidateQueries({ queryKey: FINANCE })
    },
  })
}
