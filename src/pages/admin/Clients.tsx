import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useClients, useCreateClient } from '../../hooks/useClients'
import { ApiError } from '../../api/client'

export default function Clients() {
  const [search, setSearch] = useState('')
  const { data: clients, isLoading } = useClients(search)
  const createClient = useCreateClient()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await createClient.mutateAsync({ name, phone, email: email || null })
      setName('')
      setPhone('')
      setEmail('')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao criar cliente.')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          {showForm ? 'Cancelar' : 'Novo cliente'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface p-4">
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
            E-mail (opcional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-56 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={createClient.isPending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90 disabled:opacity-60"
          >
            {createClient.isPending ? 'Salvando…' : 'Salvar'}
          </button>
          {error && <p className="w-full text-sm text-red-600">{error}</p>}
        </form>
      )}

      <input
        placeholder="Buscar por nome…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-4 w-64 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        {isLoading ? (
          <p className="p-4 text-sm text-muted">Carregando…</p>
        ) : !clients || clients.length === 0 ? (
          <p className="p-4 text-sm text-muted">Nenhum cliente cadastrado ainda.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-2 font-medium">Nome</th>
                <th className="px-4 py-2 font-medium">Telefone</th>
                <th className="px-4 py-2 font-medium">E-mail</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface-muted">
                  <td className="px-4 py-2">
                    <Link to={`/admin/clients/${c.id}`} className="font-medium text-accent hover:underline">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{c.phone}</td>
                  <td className="px-4 py-2 text-muted">{c.email ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
