import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, Plus, Search, Users } from 'lucide-react'
import { useClients, useCreateClient } from '../../hooks/useClients'
import { ApiError } from '../../api/client'
import Modal from '../../components/Modal'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

export default function Clients() {
  const [search, setSearch] = useState('')
  const { data: clients, isLoading } = useClients(search)
  const createClient = useCreateClient()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  function closeForm() {
    setShowForm(false)
    setError(null)
    setName('')
    setPhone('')
    setEmail('')
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createClient.mutateAsync({ name, phone, email: email || null })
      closeForm()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao criar cliente.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="mt-1 text-sm text-muted">Donos dos pets cadastrados no petshop.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Plus size={16} /> Novo cliente
        </button>
      </div>

      <div className="relative mt-5 w-72">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          placeholder="Buscar por nome…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-surface-muted" />
            ))}
          </div>
        ) : !clients || clients.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
            <Users size={32} className="text-muted" />
            <p className="text-sm text-muted">
              {search ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado ainda.'}
            </p>
            {!search && (
              <button onClick={() => setShowForm(true)} className="text-sm font-medium text-accent hover:underline">
                Cadastrar o primeiro cliente
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((c) => (
              <Link
                key={c.id}
                to={`/admin/clients/${c.id}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-accent hover:shadow-sm"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                  {initials(c.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <Phone size={13} /> {c.phone}
                  </p>
                  {c.email && (
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-muted">
                      <Mail size={13} /> {c.email}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <Modal title="Novo cliente" onClose={closeForm}>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <label className="text-sm">
              Nome
              <input
                required
                autoFocus
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
              E-mail (opcional)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" onClick={closeForm} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createClient.isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
              >
                {createClient.isPending ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
