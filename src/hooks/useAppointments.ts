import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as appointmentsApi from '../api/appointments'
import type { AppointmentCreateInput, AppointmentUpdateInput } from '../api/appointments'

const APPOINTMENTS = ['appointments'] as const

export function useAppointments(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: [...APPOINTMENTS, dateFrom, dateTo],
    queryFn: () => appointmentsApi.listAppointments(dateFrom, dateTo),
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AppointmentCreateInput) => appointmentsApi.createAppointment(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENTS }),
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: AppointmentUpdateInput }) =>
      appointmentsApi.updateAppointment(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENTS }),
  })
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => appointmentsApi.deleteAppointment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: APPOINTMENTS }),
  })
}
