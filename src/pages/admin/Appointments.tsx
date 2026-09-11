import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CalendarDays, Check, ChevronLeft, ChevronRight, CircleDollarSign, Plus, Trash2, X } from 'lucide-react'
import { useAppointments, useCreateAppointment, useDeleteAppointment, useUpdateAppointment } from '../../hooks/useAppointments'
import { useClients } from '../../hooks/useClients'
import { usePets } from '../../hooks/usePets'
import { useServices } from '../../hooks/useServices'
import type { Appointment, AppointmentStatus } from '../../types'
import { ApiError } from '../../api/client'
import Modal from '../../components/Modal'

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  scheduled: 'bg-accent/15 text-accent',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-surface-muted text-muted line-through',
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
}

function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + delta)
  return date.toISOString().slice(0, 10)
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatPrice(price: string): string {
  return Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Appointments() {
  const [date, setDate] = useState(todayISO())
  const { data: appointments, isLoading } = useAppointments(`${date}T00:00:00`, `${date}T23:59:59`)
  const updateAppointment = useUpdateAppointment()
  const deleteAppointment = useDeleteAppointment()

  const [showForm, setShowForm] = useState(false)

  const sorted = useMemo(
    () => [...(appointments ?? [])].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)),
    [appointments],
  )

  async function handleStatusChange(appointment: Appointment, status: AppointmentStatus) {
    await updateAppointment.mutateAsync({
      id: appointment.id,
      input: { scheduled_at: appointment.scheduled_at, status, price: Number(appointment.price), paid: appointment.paid, notes: appointment.notes },
    })
  }

  async function handleTogglePaid(appointment: Appointment) {
    await updateAppointment.mutateAsync({
      id: appointment.id,
      input: {
        scheduled_at: appointment.scheduled_at,
        status: appointment.status,
        price: Number(appointment.price),
        paid: !appointment.paid,
        notes: appointment.notes,
      },
    })
  }

  async function handleDelete(appointment: Appointment) {
    if (!confirm(`Apagar o atendimento de ${appointment.pet.name}?`)) return
    await deleteAppointment.mutateAsync(appointment.id)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Atendimentos</h1>
          <p className="mt-1 text-sm capitalize text-muted">{formatDateLabel(date)}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus size={16} /> Novo atendimento
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={() => setDate((d) => addDays(d, -1))} className="rounded-lg border border-border p-2 hover:bg-surface-muted" aria-label="Dia anterior">
          <ChevronLeft size={16} />
        </button>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button onClick={() => setDate((d) => addDays(d, 1))} className="rounded-lg border border-border p-2 hover:bg-surface-muted" aria-label="Próximo dia">
          <ChevronRight size={16} />
        </button>
        <button onClick={() => setDate(todayISO())} className="rounded-lg px-3 py-2 text-sm text-accent hover:underline">
          Hoje
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-surface-muted" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
            <CalendarDays size={28} className="text-muted" />
            <p className="text-sm text-muted">Nenhum atendimento para esse dia.</p>
            <button onClick={() => setShowForm(true)} className="text-sm font-medium text-accent hover:underline">
              Criar atendimento
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
            {sorted.map((a) => (
              <div key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-start gap-3 sm:contents">
                  <span className="w-14 shrink-0 text-sm font-medium">{formatTime(a.scheduled_at)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {a.pet.name} <span className="font-normal text-muted">· {a.pet.client_name}</span>
                    </p>
                    <p className="text-sm text-muted">
                      {a.service.name} · {formatPrice(a.price)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pl-[4.25rem] sm:shrink-0 sm:pl-0">
                  <button
                    onClick={() => handleTogglePaid(a)}
                    className={`flex shrink-0 items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
                      a.paid ? 'bg-green-100 text-green-700' : 'bg-surface-muted text-muted'
                    }`}
                  >
                    <CircleDollarSign size={13} /> {a.paid ? 'Pago' : 'Não pago'}
                  </button>
                  <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[a.status]}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                  {a.status === 'scheduled' && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => handleStatusChange(a, 'completed')}
                        aria-label="Marcar como concluído"
                        className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-green-700"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(a, 'cancelled')}
                        aria-label="Cancelar"
                        className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(a)}
                    aria-label="Apagar atendimento"
                    className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <NewAppointmentModal date={date} onClose={() => setShowForm(false)} />}
    </div>
  )
}

function NewAppointmentModal({ date, onClose }: { date: string; onClose: () => void }) {
  const { data: clients } = useClients()
  const [clientId, setClientId] = useState('')
  const { data: pets } = usePets(clientId ? Number(clientId) : undefined)
  const { data: services } = useServices()
  const createAppointment = useCreateAppointment()

  const [petId, setPetId] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [time, setTime] = useState('09:00')
  const [price, setPrice] = useState('')
  const [paid, setPaid] = useState(false)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const service = services?.find((s) => String(s.id) === serviceId)
    if (service) setPrice(service.price)
  }, [serviceId, services])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!petId || !serviceId) {
      setError('Escolha o pet e o serviço.')
      return
    }
    try {
      await createAppointment.mutateAsync({
        pet_id: Number(petId),
        service_id: Number(serviceId),
        scheduled_at: `${date}T${time}:00`,
        price: Number(price),
        paid,
        notes: notes || null,
      })
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao criar atendimento.')
    }
  }

  return (
    <Modal title="Novo atendimento" onClose={onClose}>
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
                {s.name} ({s.duration_minutes} min)
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-3">
          <label className="flex-1 text-sm">
            Horário
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="flex-1 text-sm">
            Valor (R$)
            <input
              type="number"
              min={0}
              step={0.01}
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="accent-accent" />
          Já pago
        </label>
        <label className="text-sm">
          Observações (opcional)
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createAppointment.isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
          >
            {createAppointment.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
