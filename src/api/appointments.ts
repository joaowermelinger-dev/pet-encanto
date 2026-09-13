import { apiRequest } from './client'
import type { Appointment, AppointmentStatus, PaymentMethod } from '../types'

interface GuestFields {
  pet_id?: number | null
  guest_client_name?: string | null
  guest_client_phone?: string | null
  guest_animal_name?: string | null
  guest_animal_breed?: string | null
  guest_animal_notes?: string | null
}

export interface AppointmentItemInput {
  service_id: number
  price: number
}

export interface AppointmentCreateInput extends GuestFields {
  items: AppointmentItemInput[]
  scheduled_at: string
  paid: boolean
  payment_method?: PaymentMethod | null
  notes?: string | null
}

export interface AppointmentUpdateInput extends GuestFields {
  items: AppointmentItemInput[]
  scheduled_at: string
  status: AppointmentStatus
  paid: boolean
  payment_method?: PaymentMethod | null
  notes?: string | null
}

export function listAppointments(dateFrom: string, dateTo: string): Promise<Appointment[]> {
  return apiRequest<Appointment[]>('/appointments', { query: { date_from: dateFrom, date_to: dateTo } })
}

export function createAppointment(input: AppointmentCreateInput): Promise<Appointment> {
  return apiRequest<Appointment>('/appointments', { method: 'POST', body: input })
}

export function updateAppointment(id: number, input: AppointmentUpdateInput): Promise<Appointment> {
  return apiRequest<Appointment>(`/appointments/${id}`, { method: 'PATCH', body: input })
}

export function deleteAppointment(id: number): Promise<void> {
  return apiRequest<void>(`/appointments/${id}`, { method: 'DELETE' })
}
