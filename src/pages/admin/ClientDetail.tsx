import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useClient, useDeleteClient, useUpdateClient } from '../../hooks/useClients'
import { useCreatePet, useDeletePet } from '../../hooks/usePets'
import type { PetSize, PetSpecies } from '../../types'
import { ApiError } from '../../api/client'

const SPECIES_LABEL: Record<PetSpecies, string> = { dog: 'Cachorro', cat: 'Gato', other: 'Outro' }
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

  if (isLoading) return <p className="text-sm text-muted">Carregando…</p>
  if (!client) return <p className="text-sm text-muted">Cliente não encontrado.</p>

  function startEdit() {
    setName(client!.name)
    setPhone(client!.phone)
    setEmail(client!.email ?? '')
    setAddress(client!.address ?? '')
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

  async function handleAddPet(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createPet.mutateAsync({ client_id: clientId, name: petName, species: petSpecies, breed: petBreed || null })
      setPetName('')
      setPetBreed('')
      setShowPetForm(false)
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
      <button onClick={() => navigate('/admin/clients')} className="text-sm text-muted hover:text-foreground">
        ← Voltar
      </button>

      <div className="mt-3 rounded-xl border border-border bg-surface p-5">
        {!editing ? (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold">{client.name}</h1>
                <p className="mt-1 text-sm text-muted">{client.phone}</p>
                {client.email && <p className="text-sm text-muted">{client.email}</p>}
                {client.address && <p className="text-sm text-muted">{client.address}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={startEdit} className="text-sm text-accent hover:underline">
                  Editar
                </button>
                <button onClick={handleDeleteClient} className="text-sm text-red-600 hover:underline">
                  Apagar
                </button>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSaveEdit} className="flex flex-wrap items-end gap-3">
            <label className="text-sm">
              Nome
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-48 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm">
              Telefone
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-40 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-56 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm">
              Endereço
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-64 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Salvar
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-sm text-muted hover:text-foreground">
              Cancelar
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Pets</h2>
        <button
          onClick={() => setShowPetForm((v) => !v)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          {showPetForm ? 'Cancelar' : 'Novo pet'}
        </button>
      </div>

      {showPetForm && (
        <form onSubmit={handleAddPet} className="mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4">
          <label className="text-sm">
            Nome
            <input
              required
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="mt-1 block w-40 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <label className="text-sm">
            Espécie
            <select
              value={petSpecies}
              onChange={(e) => setPetSpecies(e.target.value as PetSpecies)}
              className="mt-1 block w-36 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
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
              className="mt-1 block w-40 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={createPet.isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
          >
            {createPet.isPending ? 'Salvando…' : 'Salvar'}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        {client.pets.length === 0 ? (
          <p className="p-4 text-sm text-muted">Nenhum pet cadastrado ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Espécie</th>
                <th className="px-4 py-2 font-medium">Porte</th>
                <th className="px-4 py-2 font-medium">Raça</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {client.pets.map((pet) => (
                <tr key={pet.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium">{pet.name}</td>
                  <td className="px-4 py-2">{SPECIES_LABEL[pet.species]}</td>
                  <td className="px-4 py-2 text-muted">{pet.size ? SIZE_LABEL[pet.size] : '—'}</td>
                  <td className="px-4 py-2 text-muted">{pet.breed ?? '—'}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleDeletePet(pet.id, pet.name)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
