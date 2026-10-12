import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, History, Mail, MapPin, PawPrint, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { useClient, useDeleteClient, useUpdateClient } from '../../hooks/useClients'
import { useCreatePet, useDeletePet } from '../../hooks/usePets'
import { useAllAppointments } from '../../hooks/useAppointments'
import type { Appointment, AppointmentStatus, PetSize, PetSpecies } from '../../types'
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
  const createPet = useCreatePet()
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

  const [showPetForm, setShowPetForm] = useState(false)
  const [petName, setPetName] = useState('')
  const [petSpecies, setPetSpecies] = useState<PetSpecies>('dog')
  const [petBreed, setPetBreed] = useState('')
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

  function closePetForm() {
    setShowPetForm(false)
    setError(null)
    setPetName('')
    setPetBreed('')
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

  async function handleAddPet(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createPet.mutateAsync({ client_id: clientId, name: petName, species: petSpecies, breed: petBreed || null })
      closePetForm()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao cadastrar pet.')
    }
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
          onClick={() => setShowPetForm(true)}
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
            <button onClick={() => setShowPetForm(true)} className="text-sm font-medium text-accent hover:underline">
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
                  </p>
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
                <button
                  onClick={() => handleDeletePet(pet.id, pet.name)}
                  aria-label={`Apagar ${pet.name}`}
                  className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-red-600"
                >
                  <Trash2 size={15} />
                </button>
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

      {showPetForm && (
        <Modal title="Novo pet" onClose={closePetForm}>
          <form onSubmit={handleAddPet} className="flex flex-col gap-3">
            <label className="text-sm">
              Nome
              <input
                required
                autoFocus
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm">
              Espécie
              <select
                value={petSpecies}
                onChange={(e) => setPetSpecies(e.target.value as PetSpecies)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              >
                <option value="dog">Cachorro</option>
                <option value="cat">Gato</option>
                <option value="other">Outro</option>
              </select>
            </label>
            <label className="text-sm">
              Raça (opcional)
              <input
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" onClick={closePetForm} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createPet.isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
              >
                {createPet.isPending ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
