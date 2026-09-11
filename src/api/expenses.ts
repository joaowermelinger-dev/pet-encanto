import { apiRequest } from './client'
import type { Expense } from '../types'

export interface ExpenseInput {
  description: string
  amount: number
  expense_date: string
}

export function listExpenses(): Promise<Expense[]> {
  return apiRequest<Expense[]>('/expenses')
}

export function createExpense(input: ExpenseInput): Promise<Expense> {
  return apiRequest<Expense>('/expenses', { method: 'POST', body: input })
}

export function deleteExpense(id: number): Promise<void> {
  return apiRequest<void>(`/expenses/${id}`, { method: 'DELETE' })
}
