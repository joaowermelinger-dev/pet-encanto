import type { Appointment } from '../types'

/** Atendimento que de fato aconteceu: já passou e não foi cancelado. */
export function isPastVisit(a: Appointment, now: Date = new Date()): boolean {
  return a.status !== 'cancelled' && new Date(a.scheduled_at) <= now
}

/** Dias inteiros entre a data e agora. */
export function daysSince(iso: string, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000)
}

export function formatPrice(value: string | number): string {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
