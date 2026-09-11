import { apiRequest } from './client'
import type { Appointment, AppointmentStatus } from '../types'

export interface AppointmentCreateInput {
  pet_id: number
  service_id: number
  scheduled_at: string
  notes?: string | null
}

export interface AppointmentUpdateInput {
  scheduled_at: string
  status: AppointmentStatus
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
