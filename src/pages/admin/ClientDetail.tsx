import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, PawPrint, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { useClient, useDeleteClient, useUpdateClient } from '../../hooks/useClients'
import { useCreatePet, useDeletePet } from '../../hooks/usePets'
import type { PetSize, PetSpecies } from '../../types'
import { ApiError } from '../../api/client'
import Modal from '../../components/Modal'

const SPECIES_LABEL: Record<PetSpecies, string> = { dog: 'Cachorro', cat: 'Gato', other: 'Outro' }
const SPECIES_EMOJI: Record<PetSpecies, string> = { dog: '🐶', cat: '🐱', other: '🐾' }
const SIZE_LABEL: Record<PetSize, string> = { small: 'Pequeno', medium: 'Médio', large: 'Grande' }

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const clientId = Number(id)
  const navigate = useNavigate()
  const { data: client, isLoading } = useClient(clientId)
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()
  const createPet = useCreatePet()
  const deletePet = useDeletePet()

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
        <div className="flex items-start justify-between">
          <div>
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

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pets</h2>
        <button
          onClick={() => setShowPetForm(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
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
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-lg">
                  {SPECIES_EMOJI[pet.species]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{pet.name}</p>
                  <p className="text-sm text-muted">
                    {SPECIES_LABEL[pet.species]}
                    {pet.breed ? ` · ${pet.breed}` : ''}
                    {pet.size ? ` · ${SIZE_LABEL[pet.size]}` : ''}
                  </p>
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
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
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
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
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
