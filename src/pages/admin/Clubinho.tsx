import { useState, type FormEvent } from 'react'
import { CalendarClock, Pause, Play, Plus, RefreshCw, X } from 'lucide-react'
import {
  useCreateSubscription,
  useExtendSubscription,
  useSubscriptions,
  useUpdateSubscriptionStatus,
} from '../../hooks/useSubscriptions'
import { useClients } from '../../hooks/useClients'
import { usePets } from '../../hooks/usePets'
import { useServices } from '../../hooks/useServices'
import type { Subscription, SubscriptionFrequency } from '../../types'
import { ApiError } from '../../api/client'
import Modal from '../../components/Modal'

const FREQUENCY_LABEL: Record<SubscriptionFrequency, string> = {
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal',
}

const STATUS_LABEL = {
  active: 'Ativo',
  paused: 'Pausado',
  cancelled: 'Cancelado',
} as const

const STATUS_CLASS = {
  active: 'bg-sage/25 text-sage-foreground',
  paused: 'bg-gold/25 text-gold-foreground',
  cancelled: 'bg-surface-muted text-muted line-through',
} as const

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Clubinho() {
  const { data: subscriptions, isLoading } = useSubscriptions()
  const updateStatus = useUpdateSubscriptionStatus()
  const extend = useExtendSubscription()
  const [showForm, setShowForm] = useState(false)

  async function handlePause(sub: Subscription) {
    await updateStatus.mutateAsync({ id: sub.id, status: 'paused' })
  }
  async function handleResume(sub: Subscription) {
    await updateStatus.mutateAsync({ id: sub.id, status: 'active' })
  }
  async function handleCancel(sub: Subscription) {
    if (!confirm(`Cancelar o clubinho de ${sub.pet.name}? Os atendimentos futuros já agendados serão cancelados.`)) return
    await updateStatus.mutateAsync({ id: sub.id, status: 'cancelled' })
  }
  async function handleExtend(sub: Subscription) {
    await extend.mutateAsync(sub.id)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Clubinho</h1>
          <p className="mt-1 text-sm text-muted">
            Atendimento recorrente: o pet já fica com o horário reservado toda semana, quinzena ou mês.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
        >
          <Plus size={16} /> Novo clubinho
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-surface-muted" />
            ))}
          </div>
        ) : !subscriptions || subscriptions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
            <CalendarClock size={28} className="text-muted" />
            <p className="text-sm text-muted">Nenhum clubinho cadastrado ainda.</p>
            <button onClick={() => setShowForm(true)} className="text-sm font-medium text-accent hover:underline">
              Cadastrar o primeiro clubinho
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {sub.pet.name} <span className="font-normal text-muted">· {sub.pet.client_name}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {sub.service.name} · {FREQUENCY_LABEL[sub.frequency]}
                  </p>
                  {sub.next_occurrence_at && (
                    <p className="mt-0.5 text-xs text-muted">Próximo: {formatDateTime(sub.next_occurrence_at)}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[sub.status]}`}>
                    {STATUS_LABEL[sub.status]}
                  </span>
                  {sub.status === 'active' && (
                    <>
                      <button
                        onClick={() => handleExtend(sub)}
                        aria-label="Gerar mais atendimentos"
                        title="Gerar mais atendimentos"
                        className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-accent"
                      >
                        <RefreshCw size={15} />
                      </button>
                      <button
                        onClick={() => handlePause(sub)}
                        aria-label="Pausar clubinho"
                        title="Pausar"
                        className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-gold-foreground"
                      >
                        <Pause size={15} />
                      </button>
                    </>
                  )}
                  {sub.status === 'paused' && (
                    <button
                      onClick={() => handleResume(sub)}
                      aria-label="Retomar clubinho"
                      title="Retomar"
                      className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-sage-foreground"
                    >
                      <Play size={15} />
                    </button>
                  )}
                  {sub.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(sub)}
                      aria-label="Cancelar clubinho"
                      title="Cancelar"
                      className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-red-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <NewSubscriptionModal onClose={() => setShowForm(false)} />}
    </div>
  )
}

function NewSubscriptionModal({ onClose }: { onClose: () => void }) {
  const { data: clients } = useClients()
  const [clientId, setClientId] = useState('')
  const { data: pets } = usePets(clientId ? Number(clientId) : undefined)
  const { data: services } = useServices()
  const createSubscription = useCreateSubscription()

  const [petId, setPetId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('weekly')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!petId || !serviceId || !date) {
      setError('Escolha o pet, o serviço e a data do primeiro atendimento.')
      return
    }
    try {
      await createSubscription.mutateAsync({
        pet_id: Number(petId),
        service_id: Number(serviceId),
        frequency,
        first_occurrence_at: `${date}T${time}:00`,
      })
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao criar clubinho.')
    }
  }

  return (
    <Modal title="Novo clubinho" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm">
          Cliente
          <select
            required
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value)
              setPetId('')
            }}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          >
            <option value="">Selecione…</option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Pet
          <select
            required
            disabled={!clientId}
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent disabled:opacity-50"
          >
            <option value="">{clientId ? 'Selecione…' : 'Escolha um cliente primeiro'}</option>
            {pets?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Qual serviço
          <select
            required
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          >
            <option value="">Selecione…</option>
            {services?.filter((s) => s.is_active).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Frequência
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          >
            <option value="weekly">Semanal</option>
            <option value="biweekly">Quinzenal</option>
            <option value="monthly">Mensal</option>
          </select>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="text-sm sm:flex-1">
            Data do 1º atendimento
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="text-sm sm:flex-1">
            Horário
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
        </div>
        <p className="text-xs text-muted">
          O dia da semana (ou do mês) e o horário do 1º atendimento se repetem em todas as próximas ocorrências.
          São geradas automaticamente as visitas dos próximos 3 meses.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createSubscription.isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {createSubscription.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
