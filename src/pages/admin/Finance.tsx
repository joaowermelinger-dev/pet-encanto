import { useState, type FormEvent } from 'react'
import { Banknote, CreditCard, Plus, QrCode, Trash2, Wallet } from 'lucide-react'
import { useCreateExpense, useDeleteExpense, useFinanceSummary } from '../../hooks/useFinance'
import { ApiError } from '../../api/client'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function firstOfMonthISO(): string {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10)
}

function formatPrice(value: string): string {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

const METHOD_ICON = { cash: Banknote, card: CreditCard, pix: QrCode, other: Wallet } as const
const METHOD_LABEL = { cash: 'Dinheiro', card: 'Cartão', pix: 'Pix', other: 'Outro' } as const

export default function Finance() {
  const [dateFrom, setDateFrom] = useState(firstOfMonthISO())
  const [dateTo, setDateTo] = useState(todayISO())
  const { data: summary, isLoading } = useFinanceSummary(dateFrom, dateTo)
  const createExpense = useCreateExpense()
  const deleteExpense = useDeleteExpense()

  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [expenseDate, setExpenseDate] = useState(todayISO())
  const [error, setError] = useState<string | null>(null)

  function setPreset(preset: 'today' | 'week' | 'month') {
    const now = new Date()
    if (preset === 'today') {
      setDateFrom(todayISO())
      setDateTo(todayISO())
    } else if (preset === 'week') {
      const day = now.getDay()
      const monday = new Date(now)
      monday.setDate(now.getDate() - ((day + 6) % 7))
      setDateFrom(monday.toISOString().slice(0, 10))
      setDateTo(todayISO())
    } else {
      setDateFrom(firstOfMonthISO())
      setDateTo(todayISO())
    }
  }

  async function handleAddExpense(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createExpense.mutateAsync({ description, amount: Number(amount), expense_date: expenseDate })
      setDescription('')
      setAmount('')
      setExpenseDate(todayISO())
      setShowExpenseForm(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao lançar despesa.')
    }
  }

  async function handleDeleteExpense(id: number, desc: string) {
    if (!confirm(`Apagar a despesa "${desc}"?`)) return
    await deleteExpense.mutateAsync(id)
  }

  const daysWithRevenue = summary?.daily.filter((d) => Number(d.revenue) > 0) ?? []

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Financeiro</h1>
          <p className="mt-1 text-sm text-muted">Receita dos atendimentos pagos e despesas do período.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setPreset('today')} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-muted">
          Hoje
        </button>
        <button onClick={() => setPreset('week')} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-muted">
          Esta semana
        </button>
        <button onClick={() => setPreset('month')} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-muted">
          Este mês
        </button>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <span className="text-sm text-muted">até</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      {isLoading || !summary ? (
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface-muted" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-muted">Receita</p>
              <p className="mt-1 text-xl font-semibold text-sage-foreground">{formatPrice(summary.total_revenue)}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-muted">A receber</p>
              <p className="mt-1 text-xl font-semibold text-gold-foreground">{formatPrice(summary.total_pending)}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-muted">Despesas</p>
              <p className="mt-1 text-xl font-semibold text-red-600">{formatPrice(summary.total_expenses)}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-muted">Saldo</p>
              <p className={`mt-1 text-xl font-semibold ${Number(summary.net) >= 0 ? 'text-accent' : 'text-red-600'}`}>
                {formatPrice(summary.net)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold">Receita por forma de pagamento</h2>
              <div className="mt-3 flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
                {(Object.keys(METHOD_LABEL) as (keyof typeof METHOD_LABEL)[]).map((method) => {
                  const Icon = METHOD_ICON[method]
                  return (
                    <div key={method} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted">
                        <Icon size={15} /> {METHOD_LABEL[method]}
                      </span>
                      <span className="font-medium">{formatPrice(summary.revenue_by_method[method])}</span>
                    </div>
                  )
                })}
              </div>

              {daysWithRevenue.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-muted">Receita por dia</h3>
                  <div className="mt-2 flex max-h-64 flex-col divide-y divide-border overflow-y-auto rounded-xl border border-border bg-surface">
                    {daysWithRevenue.map((d) => (
                      <div key={d.date} className="flex items-center justify-between px-4 py-2 text-sm">
                        <span className="text-muted">{formatDate(d.date)}</span>
                        <span className="font-medium">{formatPrice(d.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Despesas</h2>
                <button
                  onClick={() => setShowExpenseForm((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
                >
                  <Plus size={15} /> Nova despesa
                </button>
              </div>

              {showExpenseForm && (
                <form onSubmit={handleAddExpense} className="mt-3 flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
                  <label className="text-sm">
                    Descrição
                    <input
                      required
                      autoFocus
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                    />
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label className="text-sm sm:flex-1">
                      Valor (R$)
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                      />
                    </label>
                    <label className="text-sm sm:flex-1">
                      Data
                      <input
                        type="date"
                        required
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        className="mt-1 block w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                      />
                    </label>
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowExpenseForm(false)} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground">
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={createExpense.isPending}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
                    >
                      {createExpense.isPending ? 'Salvando…' : 'Salvar'}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-3">
                {summary.expenses.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted">
                    Nenhuma despesa nesse período.
                  </p>
                ) : (
                  <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                    {summary.expenses.map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{exp.description}</p>
                          <p className="text-xs text-muted">{formatDate(exp.expense_date)}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="font-medium text-red-600">{formatPrice(exp.amount)}</span>
                          <button
                            onClick={() => handleDeleteExpense(exp.id, exp.description)}
                            aria-label={`Apagar ${exp.description}`}
                            className="rounded-lg p-1 text-muted hover:bg-surface-muted hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
