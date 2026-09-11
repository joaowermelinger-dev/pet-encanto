import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CalendarDays, Check, ChevronLeft, ChevronRight, CircleDollarSign, Pencil, Plus, Trash2, X } from 'lucide-react'
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
  scheduled: 'bg-gold/25 text-gold-foreground',
  completed: 'bg-sage/25 text-sage-foreground',
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

/** Nome do animal e do dono, seja um pet cadastrado ou um atendimento avulso. */
function appointmentNames(a: Appointment): { animal: string; client: string } {
  if (a.pet) return { animal: a.pet.name, client: a.pet.client_name ?? '' }
  return { animal: a.guest_animal_name ?? '—', client: a.guest_client_name ?? '' }
}

export default function Appointments() {
  const [date, setDate] = useState(todayISO())
  const { data: appointments, isLoading } = useAppointments(`${date}T00:00:00`, `${date}T23:59:59`)
  const updateAppointment = useUpdateAppointment()
  const deleteAppointment = useDeleteAppointment()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Appointment | null>(null)

  const sorted = useMemo(
    () => [...(appointments ?? [])].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at)),
    [appointments],
  )

  async function handleStatusChange(appointment: Appointment, status: AppointmentStatus) {
    await updateAppointment.mutateAsync({
      id: appointment.id,
      input: {
        pet_id: appointment.pet_id,
        guest_client_name: appointment.guest_client_name,
        guest_client_phone: appointment.guest_client_phone,
        guest_animal_name: appointment.guest_animal_name,
        guest_animal_breed: appointment.guest_animal_breed,
        guest_animal_notes: appointment.guest_animal_notes,
        service_id: appointment.service_id,
        scheduled_at: appointment.scheduled_at,
        status,
        price: Number(appointment.price),
        paid: appointment.paid,
        notes: appointment.notes,
      },
    })
  }

  async function handleTogglePaid(appointment: Appointment) {
    await updateAppointment.mutateAsync({
      id: appointment.id,
      input: {
        pet_id: appointment.pet_id,
        guest_client_name: appointment.guest_client_name,
        guest_client_phone: appointment.guest_client_phone,
        guest_animal_name: appointment.guest_animal_name,
        guest_animal_breed: appointment.guest_animal_breed,
        guest_animal_notes: appointment.guest_animal_notes,
        service_id: appointment.service_id,
        scheduled_at: appointment.scheduled_at,
        status: appointment.status,
        price: Number(appointment.price),
        paid: !appointment.paid,
        notes: appointment.notes,
      },
    })
  }

  async function handleDelete(appointment: Appointment) {
    const { animal } = appointmentNames(appointment)
    if (!confirm(`Apagar o atendimento de ${animal}?`)) return
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
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
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
            {sorted.map((a) => {
              const { animal, client } = appointmentNames(a)
              return (
                <div key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-start gap-3 sm:contents">
                    <span className="w-14 shrink-0 text-sm font-medium">{formatTime(a.scheduled_at)}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {animal} {client && <span className="font-normal text-muted">· {client}</span>}
                        {!a.pet && <span className="ml-1.5 rounded bg-gold/25 px-1.5 py-0.5 text-[10px] font-medium text-gold-foreground">avulso</span>}
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
                        a.paid ? 'bg-sage/25 text-sage-foreground' : 'bg-surface-muted text-muted'
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
                          className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-accent"
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
                      onClick={() => setEditing(a)}
                      aria-label="Editar atendimento"
                      className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-accent"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(a)}
                      aria-label="Apagar atendimento"
                      className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showForm && <AppointmentFormModal date={date} onClose={() => setShowForm(false)} />}
      {editing && <AppointmentFormModal date={date} appointment={editing} onClose={() => setEditing(null)} />}
    </div>
  )
}

interface AppointmentFormModalProps {
  date: string
  appointment?: Appointment
  onClose: () => void
}

function AppointmentFormModal({ date, appointment, onClose }: AppointmentFormModalProps) {
  const isEdit = !!appointment
  const { data: clients } = useClients()
  const { data: services } = useServices()
  const createAppointment = useCreateAppointment()
  const updateAppointment = useUpdateAppointment()

  const [registered, setRegistered] = useState(!appointment || !!appointment.pet_id)
  const [clientId, setClientId] = useState(appointment?.pet?.client_id ? String(appointment.pet.client_id) : '')
  const { data: pets } = usePets(clientId ? Number(clientId) : undefined)
  const [petId, setPetId] = useState(appointment?.pet_id ? String(appointment.pet_id) : '')

  const [guestClientName, setGuestClientName] = useState(appointment?.guest_client_name ?? '')
  const [guestClientPhone, setGuestClientPhone] = useState(appointment?.guest_client_phone ?? '')
  const [guestAnimalName, setGuestAnimalName] = useState(appointment?.guest_animal_name ?? '')
  const [guestAnimalBreed, setGuestAnimalBreed] = useState(appointment?.guest_animal_breed ?? '')
  const [guestAnimalNotes, setGuestAnimalNotes] = useState(appointment?.guest_animal_notes ?? '')

  const [serviceId, setServiceId] = useState(appointment ? String(appointment.service_id) : '')
  const [dateValue, setDateValue] = useState(appointment ? appointment.scheduled_at.slice(0, 10) : date)
  const [time, setTime] = useState(appointment ? appointment.scheduled_at.slice(11, 16) : '09:00')
  const [price, setPrice] = useState(appointment ? appointment.price : '')
  const [paid, setPaid] = useState(appointment?.paid ?? false)
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status ?? 'scheduled')
  const [notes, setNotes] = useState(appointment?.notes ?? '')
  const [error, setError] = useState<string | null>(null)

  const saving = createAppointment.isPending || updateAppointment.isPending

  // Sugere o preço do catálogo ao trocar de serviço — só quando ainda não tem preço definido
  // (evita sobrescrever um valor já digitado ou o preço salvo ao abrir para editar).
  useEffect(() => {
    if (isEdit) return
    const service = services?.find((s) => String(s.id) === serviceId)
    if (service) setPrice(service.price)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, services])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!serviceId) {
      setError('Escolha o serviço.')
      return
    }
    if (registered && !petId) {
      setError('Escolha o cliente e o pet.')
      return
    }
    if (!registered && (!guestClientName || !guestAnimalName)) {
      setError('Informe ao menos o nome do cliente e do animal.')
      return
    }

    const base = {
      service_id: Number(serviceId),
      scheduled_at: `${dateValue}T${time}:00`,
      price: Number(price),
      paid,
      notes: notes || null,
      pet_id: registered ? Number(petId) : null,
      guest_client_name: registered ? null : guestClientName,
      guest_client_phone: registered ? null : guestClientPhone || null,
      guest_animal_name: registered ? null : guestAnimalName,
      guest_animal_breed: registered ? null : guestAnimalBreed || null,
      guest_animal_notes: registered ? null : guestAnimalNotes || null,
    }

    try {
      if (isEdit) {
        await updateAppointment.mutateAsync({ id: appointment.id, input: { ...base, status } })
      } else {
        await createAppointment.mutateAsync(base)
      }
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao salvar atendimento.')
    }
  }

  return (
    <Modal title={isEdit ? 'Editar atendimento' : 'Novo atendimento'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex rounded-lg border border-border p-1 text-sm">
          <button
            type="button"
            onClick={() => setRegistered(true)}
            className={`flex-1 rounded-md py-1.5 font-medium ${registered ? 'bg-accent text-accent-foreground' : 'text-muted'}`}
          >
            Cliente cadastrado
          </button>
          <button
            type="button"
            onClick={() => setRegistered(false)}
            className={`flex-1 rounded-md py-1.5 font-medium ${!registered ? 'bg-accent text-accent-foreground' : 'text-muted'}`}
          >
            Avulso (sem cadastro)
          </button>
        </div>

        {registered ? (
          <>
            <label className="text-sm">
              Cliente
              <select
                required={registered}
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
                required={registered}
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
          </>
        ) : (
          <>
            <div className="flex gap-3">
              <label className="flex-1 text-sm">
                Nome do cliente
                <input
                  required={!registered}
                  value={guestClientName}
                  onChange={(e) => setGuestClientName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                />
              </label>
              <label className="flex-1 text-sm">
                Número do cliente
                <input
                  value={guestClientPhone}
                  onChange={(e) => setGuestClientPhone(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                />
              </label>
            </div>
            <div className="flex gap-3">
              <label className="flex-1 text-sm">
                Animal
                <input
                  required={!registered}
                  value={guestAnimalName}
                  onChange={(e) => setGuestAnimalName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                />
              </label>
              <label className="flex-1 text-sm">
                Raça do animal
                <input
                  value={guestAnimalBreed}
                  onChange={(e) => setGuestAnimalBreed(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                />
              </label>
            </div>
            <label className="text-sm">
              Observações sobre o animal
              <textarea
                value={guestAnimalNotes}
                onChange={(e) => setGuestAnimalNotes(e.target.value)}
                placeholder="Ex.: é manso, tem alergia a..."
                rows={2}
                className="mt-1 block w-full resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
          </>
        )}

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
            Data
            <input
              type="date"
              required
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
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
        </div>

        <div className="flex gap-3">
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
          {isEdit && (
            <label className="flex-1 text-sm">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              >
                <option value="scheduled">Agendado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </label>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="accent-accent" />
          Já pago
        </label>
        <label className="text-sm">
          Observações do atendimento (opcional)
          <input
            value={notes ?? ''}
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
            disabled={saving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
