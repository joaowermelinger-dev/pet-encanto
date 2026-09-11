import { Link } from 'react-router-dom'
import { CalendarDays, PawPrint, Users, Wallet } from 'lucide-react'
import { useAppointments } from '../../hooks/useAppointments'
import { useClients } from '../../hooks/useClients'
import { usePets } from '../../hooks/usePets'
import { useFinanceSummary } from '../../hooks/useFinance'

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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function appointmentName(a: { pet: { name: string; client_name?: string | null } | null; guest_animal_name: string | null; guest_client_name: string | null }) {
  if (a.pet) return { animal: a.pet.name, client: a.pet.client_name ?? '' }
  return { animal: a.guest_animal_name ?? '—', client: a.guest_client_name ?? '' }
}

export default function Dashboard() {
  const today = todayISO()
  const { data: clients } = useClients()
  const { data: pets } = usePets()
  const { data: todayAppointments, isLoading: loadingAppointments } = useAppointments(`${today}T00:00:00`, `${today}T23:59:59`)
  const { data: finance, isLoading: loadingFinance } = useFinanceSummary(firstOfMonthISO(), today)

  const sortedToday = [...(todayAppointments ?? [])].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at))

  return (
    <div>
      <h1 className="text-2xl font-semibold">Painel</h1>
      <p className="mt-1 text-sm text-muted">
        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <Users size={13} /> Clientes
          </p>
          <p className="mt-1 text-xl font-semibold">{clients?.length ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <PawPrint size={13} /> Pets
          </p>
          <p className="mt-1 text-xl font-semibold">{pets?.length ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <CalendarDays size={13} /> Atendimentos hoje
          </p>
          <p className="mt-1 text-xl font-semibold">{todayAppointments?.length ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <Wallet size={13} /> Receita do mês
          </p>
          <p className="mt-1 text-xl font-semibold text-sage-foreground">
            {finance ? formatPrice(finance.total_revenue) : '—'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Agenda de hoje</h2>
            <Link to="/admin/appointments" className="text-sm text-accent hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="mt-3">
            {loadingAppointments ? (
              <div className="h-24 animate-pulse rounded-xl border border-border bg-surface-muted" />
            ) : sortedToday.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted">
                Nenhum atendimento hoje.
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
                {sortedToday.map((a) => {
                  const { animal, client } = appointmentName(a)
                  return (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <span className="w-12 shrink-0 font-medium">{formatTime(a.scheduled_at)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate">
                          {animal} <span className="text-muted">· {client}</span>
                        </p>
                        <p className="truncate text-xs text-muted">{a.service.name}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Financeiro do mês</h2>
            <Link to="/admin/finance" className="text-sm text-accent hover:underline">
              Ver detalhes
            </Link>
          </div>

          <div className="mt-3">
            {loadingFinance || !finance ? (
              <div className="h-24 animate-pulse rounded-xl border border-border bg-surface-muted" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs text-muted">Receita</p>
                  <p className="mt-1 font-semibold text-sage-foreground">{formatPrice(finance.total_revenue)}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs text-muted">A receber</p>
                  <p className="mt-1 font-semibold text-gold-foreground">{formatPrice(finance.total_pending)}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs text-muted">Despesas</p>
                  <p className="mt-1 font-semibold text-red-600">{formatPrice(finance.total_expenses)}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs text-muted">Saldo</p>
                  <p className={`mt-1 font-semibold ${Number(finance.net) >= 0 ? 'text-accent' : 'text-red-600'}`}>
                    {formatPrice(finance.net)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
