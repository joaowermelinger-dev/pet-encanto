import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as financeApi from '../api/finance'
import * as expensesApi from '../api/expenses'
import type { ExpenseInput } from '../api/expenses'

export function useFinanceSummary(dateFrom: string, dateTo: string) {
  return useQuery({
    queryKey: ['finance', 'summary', dateFrom, dateTo],
    queryFn: () => financeApi.getFinanceSummary(dateFrom, dateTo),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ExpenseInput) => expensesApi.createExpense(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance'] }),
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => expensesApi.deleteExpense(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['finance'] }),
  })
}
