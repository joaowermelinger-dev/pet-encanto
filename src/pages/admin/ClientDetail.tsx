import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, History, Mail, MapPin, PawPrint, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { useClient, useDeleteClient, useUpdateClient } from '../../hooks/useClients'
import { useCreatePet, useDeletePet, useUpdatePet } from '../../hooks/usePets'
import { useAllAppointments } from '../../hooks/useAppointments'
import type { Appointment, AppointmentStatus, Pet, PetSize, PetSpecies } from '../../types'
import { ApiError } from '../../api/client'
import Modal from '../../components/Modal'
import { formatPrice, formatShortDate, isPastVisit } from '../../utils/visits'

const SPECIES_LABEL: Record<PetSpecies, string> = { dog: 'Cachorro', cat: 'Gato', other: 'Outro' }
const SPECIES_EMOJI: Record<PetSpecies, string> = { dog: '🐶', cat: '🐱', other: '🐾' }
const SIZE_LABEL: Record<PetSize, string> = { small: 'Pequeno', medium: 'Médio', large: 'Grande' }
const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

/** Quantos atendimentos do histórico aparecem antes do "Ver todos". */
const HISTORY_PREVIEW = 10

interface PetStats {
  lastVisit: string | null
  visits: number
  totalPaid: number
}

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const clientId = Number(id)
  const navigate = useNavigate()
  const { data: client, isLoading } = useClient(clientId)
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()
  const deletePet = useDeletePet()
  const { data: allAppointments } = useAllAppointments()
  const [showAllHistory, setShowAllHistory] = useState(false)

  // Atendimentos dos pets deste cliente, do mais recente para o mais antigo.
  const history = useMemo<Appointment[]>(
    () =>
      (allAppointments ?? [])
        .filter((a) => a.pet?.client_id === clientId)
        .sort((a, b) => b.scheduled_at.localeCompare(a.scheduled_at)),
    [allAppointments, clientId],
  )

  const statsByPet = useMemo(() => {
    const stats = new Map<number, PetStats>()
    for (const a of history) {
      if (a.pet_id === null) continue
      const s = stats.get(a.pet_id) ?? { lastVisit: null, visits: 0, totalPaid: 0 }
      if (isPastVisit(a)) {
        s.visits += 1
        if (!s.lastVisit || a.scheduled_at > s.lastVisit) s.lastVisit = a.scheduled_at
      }
      if (a.paid) s.totalPaid += Number(a.price)
      stats.set(a.pet_id, s)
    }
    return stats
  }, [history])

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  // null = fechado; { pet: undefined } = novo pet; { pet } = editando.
  const [petForm, setPetForm] = useState<{ pet?: Pet } | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-xl border border-border bg-surface-muted" />
  }
  if (!client) return <p className="text-sm text-muted">Cliente não encontrado.</p>

  function startEdit() {
    setName(client!.name)
    setPhone(client!.phone)
    setEmail(client!.email ?? '')
    setAddress(client!.address ?? '')
    setError(null)
    setEditing(true)
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await updateClient.mutateAsync({
        id: clientId,
        input: { name, phone, email: email || null, address: address || null },
      })
      setEditing(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao salvar.')
    }
  }

  async function handleDeleteClient() {
    if (!confirm(`Apagar ${client!.name} e todos os pets cadastrados?`)) return
    await deleteClient.mutateAsync(clientId)
    navigate('/admin/clients')
  }

  async function handleDeletePet(petId: number, petName: string) {
    if (!confirm(`Apagar o pet ${petName}?`)) return
    await deletePet.mutateAsync(petId)
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin/clients')}
        className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={15} /> Voltar
      </button>

      <div className="mt-3 rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold">{client.name}</h1>
            <div className="mt-2 flex flex-col gap-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Phone size={14} /> {client.phone}
              </span>
              {client.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={14} /> {client.email}
                </span>
              )}
              {client.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {client.address}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={startEdit}
              aria-label="Editar cliente"
              className="rounded-lg p-2 text-muted hover:bg-surface-muted hover:text-accent"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDeleteClient}
              aria-label="Apagar cliente"
              className="rounded-lg p-2 text-muted hover:bg-surface-muted hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Pets</h2>
        <button
          onClick={() => setPetForm({})}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
        >
          <Plus size={16} /> Novo pet
        </button>
      </div>

      <div className="mt-4">
        {client.pets.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
            <PawPrint size={28} className="text-muted" />
            <p className="text-sm text-muted">Nenhum pet cadastrado ainda.</p>
            <button onClick={() => setPetForm({})} className="text-sm font-medium text-accent hover:underline">
              Cadastrar o primeiro pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {client.pets.map((pet) => (
              <div key={pet.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/25 text-lg">
                  {SPECIES_EMOJI[pet.species]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{pet.name}</p>
                  <p className="text-sm text-muted">
                    {SPECIES_LABEL[pet.species]}
                    {pet.breed ? ` · ${pet.breed}` : ''}
                    {pet.size ? ` · ${SIZE_LABEL[pet.size]}` : ''}
                    {pet.birth_date ? ` · ${petAge(pet.birth_date)}` : ''}
                  </p>
                  {pet.notes && <p className="mt-1 text-xs text-gold-foreground">⚠ {pet.notes}</p>}
                  {(() => {
                    const s = statsByPet.get(pet.id)
                    if (!s || s.visits === 0) return <p className="mt-1.5 text-xs text-muted">Ainda sem atendimentos.</p>
                    return (
                      <p className="mt-1.5 text-xs text-muted">
                        Última visita {formatShortDate(s.lastVisit!)} · {s.visits}{' '}
                        {s.visits === 1 ? 'visita' : 'visitas'} · gastou{' '}
                        <span className="font-medium text-foreground">{formatPrice(s.totalPaid)}</span>
                      </p>
                    )
                  })()}
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <button
                    onClick={() => setPetForm({ pet })}
                    aria-label={`Editar ${pet.name}`}
                    className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-accent"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDeletePet(pet.id, pet.name)}
                    aria-label={`Apagar ${pet.name}`}
                    className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <History size={18} /> Histórico de atendimentos
          </h2>
          <div className="mt-3 flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
            {(showAllHistory ? history : history.slice(0, HISTORY_PREVIEW)).map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {a.pet?.name} <span className="font-normal text-muted">· {a.items.map((i) => i.service.name).join(' + ')}</span>
                  </p>
                  <p className="text-xs text-muted">
                    {formatShortDate(a.scheduled_at)} · {STATUS_LABEL[a.status]}
                    {a.status !== 'cancelled' && (a.paid ? ' · pago' : ' · não pago')}
                  </p>
                </div>
                <span className={`shrink-0 font-medium ${a.status === 'cancelled' ? 'text-muted line-through' : ''}`}>
                  {formatPrice(a.price)}
                </span>
              </div>
            ))}
          </div>
          {history.length > HISTORY_PREVIEW && (
            <button
              onClick={() => setShowAllHistory((v) => !v)}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              {showAllHistory ? 'Mostrar menos' : `Ver todos (${history.length})`}
            </button>
          )}
        </div>
      )}

      {editing && (
        <Modal title="Editar cliente" onClose={() => setEditing(false)}>
          <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
            <label className="text-sm">
              Nome
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm">
              Telefone
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm">
              Endereço
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={updateClient.isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
              >
                {updateClient.isPending ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {petForm && <PetFormModal clientId={clientId} pet={petForm.pet} onClose={() => setPetForm(null)} />}
    </div>
  )
}

/** Idade a partir da data de nascimento (AAAA-MM-DD), ex.: "3 anos" ou "5 meses". */
function petAge(birthDate: string): string {
  const [y, m, d] = birthDate.split('-').map(Number)
  const now = new Date()
  let months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
  if (now.getDate() < d) months -= 1
  if (months < 1) return 'menos de 1 mês'
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`
  const years = Math.floor(months / 12)
  return `${years} ${years === 1 ? 'ano' : 'anos'}`
}

interface PetFormModalProps {
  clientId: number
  pet?: Pet
  onClose: () => void
}

function PetFormModal({ clientId, pet, onClose }: PetFormModalProps) {
  const createPet = useCreatePet()
  const updatePet = useUpdatePet()
  const [name, setName] = useState(pet?.name ?? '')
  const [species, setSpecies] = useState<PetSpecies>(pet?.species ?? 'dog')
  const [breed, setBreed] = useState(pet?.breed ?? '')
  const [size, setSize] = useState<PetSize | ''>(pet?.size ?? '')
  const [birthDate, setBirthDate] = useState(pet?.birth_date ?? '')
  const [notes, setNotes] = useState(pet?.notes ?? '')
  const [error, setError] = useState<string | null>(null)
  const saving = createPet.isPending || updatePet.isPending

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const input = {
      name,
      species,
      breed: breed || null,
      size: size || null,
      birth_date: birthDate || null,
      notes: notes || null,
    }
    try {
      if (pet) await updatePet.mutateAsync({ id: pet.id, input })
      else await createPet.mutateAsync({ client_id: clientId, ...input })
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao salvar o pet.')
    }
  }

  const fieldClass =
    'mt-1 block w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent'

  return (
    <Modal title={pet ? `Editar ${pet.name}` : 'Novo pet'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm">
          Nome
          <input required autoFocus value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="text-sm sm:flex-1">
            Espécie
            <select value={species} onChange={(e) => setSpecies(e.target.value as PetSpecies)} className={fieldClass}>
              <option value="dog">Cachorro</option>
              <option value="cat">Gato</option>
              <option value="other">Outro</option>
            </select>
          </label>
          <label className="text-sm sm:flex-1">
            Porte
            <select value={size} onChange={(e) => setSize(e.target.value as PetSize | '')} className={fieldClass}>
              <option value="">Não informado</option>
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
            </select>
          </label>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="text-sm sm:flex-1">
            Raça (opcional)
            <input value={breed} onChange={(e) => setBreed(e.target.value)} className={fieldClass} />
          </label>
          <label className="text-sm sm:flex-1">
            Nascimento (opcional)
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={fieldClass} />
          </label>
        </div>
        <label className="text-sm">
          Observações (alergias, temperamento…)
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={fieldClass} />
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
