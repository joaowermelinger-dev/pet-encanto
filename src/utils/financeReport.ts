import { listAppointments } from '../api/appointments'
import type { Appointment, FinanceSummary } from '../types'

const METHOD_LABEL = { cash: 'Dinheiro', card: 'Cartão', pix: 'Pix', other: 'Outro' } as const
const STATUS_LABEL = { scheduled: 'Agendado', completed: 'Concluído', cancelled: 'Cancelado' } as const

/** Número no formato do Excel em português (vírgula decimal, sem milhar). */
function money(value: string | number): string {
  return Number(value).toFixed(2).replace('.', ',')
}

function brDate(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

function cell(value: string): string {
  return /[;"\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

function appointmentRow(a: Appointment): string[] {
  const when = new Date(a.scheduled_at)
  const animal = a.pet?.name ?? a.guest_animal_name ?? ''
  const client = a.pet?.client_name ?? a.guest_client_name ?? ''
  return [
    when.toLocaleDateString('pt-BR'),
    when.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    animal,
    client,
    a.items.map((i) => i.service.name).join(' + '),
    STATUS_LABEL[a.status],
    a.paid ? 'Sim' : 'Não',
    a.paid && a.payment_method ? METHOD_LABEL[a.payment_method] : '',
    money(a.price),
  ]
}

/**
 * Baixa o relatório do período em CSV com ";" (abre direto no Excel em
 * português): resumo, receita por forma de pagamento e por dia, despesas e
 * a lista de atendimentos.
 */
export async function downloadFinanceReport(dateFrom: string, dateTo: string, summary: FinanceSummary): Promise<void> {
  const appointments = await listAppointments(`${dateFrom}T00:00:00`, `${dateTo}T23:59:59`)
  const rows: string[][] = [
    [`Relatório financeiro Pet Encanto: ${brDate(dateFrom)} a ${brDate(dateTo)}`],
    [],
    ['Resumo', 'Valor (R$)'],
    ['Receita', money(summary.total_revenue)],
    ['A receber', money(summary.total_pending)],
    ['Despesas', money(summary.total_expenses)],
    ['Saldo', money(summary.net)],
    [],
    ['Receita por forma de pagamento', 'Valor (R$)'],
    ...(Object.keys(METHOD_LABEL) as (keyof typeof METHOD_LABEL)[]).map((m) => [
      METHOD_LABEL[m],
      money(summary.revenue_by_method[m]),
    ]),
    [],
    ['Receita por dia', 'Valor (R$)'],
    ...summary.daily.map((d) => [brDate(d.date), money(d.revenue)]),
    [],
    ['Despesas', 'Data', 'Valor (R$)'],
    ...summary.expenses.map((e) => [e.description, brDate(e.expense_date), money(e.amount)]),
    [],
    ['Atendimentos', 'Hora', 'Animal', 'Cliente', 'Serviços', 'Status', 'Pago', 'Forma de pagamento', 'Valor (R$)'],
    ...[...appointments].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)).map(appointmentRow),
  ]

  // BOM para o Excel reconhecer os acentos (UTF-8).
  const csv = '﻿' + rows.map((r) => r.map(cell).join(';')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `financeiro-${dateFrom}-a-${dateTo}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
