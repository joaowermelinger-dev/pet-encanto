import { apiRequest } from './client'
import type { Subscription, SubscriptionFrequency, SubscriptionStatus } from '../types'

export interface SubscriptionCreateInput {
  pet_id: number
  service_id: number
  frequency: SubscriptionFrequency
  first_occurrence_at: string
}

export function listSubscriptions(): Promise<Subscription[]> {
  return apiRequest<Subscription[]>('/subscriptions')
}

export function createSubscription(input: SubscriptionCreateInput): Promise<Subscription> {
  return apiRequest<Subscription>('/subscriptions', { method: 'POST', body: input })
}

export function updateSubscriptionStatus(id: number, subscriptionStatus: SubscriptionStatus): Promise<Subscription> {
  return apiRequest<Subscription>(`/subscriptions/${id}`, { method: 'PATCH', body: { status: subscriptionStatus } })
}

export function extendSubscription(id: number): Promise<Subscription> {
  return apiRequest<Subscription>(`/subscriptions/${id}/extend`, { method: 'POST' })
}
