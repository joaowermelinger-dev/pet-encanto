import { apiRequest } from './client'
import type { FinanceSummary } from '../types'

export function getFinanceSummary(dateFrom: string, dateTo: string): Promise<FinanceSummary> {
  return apiRequest<FinanceSummary>('/finance/summary', { query: { date_from: dateFrom, date_to: dateTo } })
}
