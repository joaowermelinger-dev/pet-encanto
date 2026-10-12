import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Mail, MessageCircle, Phone, Plus, Search, Users } from 'lucide-react'
import { useClients, useCreateClient } from '../../hooks/useClients'
import { useAllAppointments } from '../../hooks/useAppointments'
import { ApiError } from '../../api/client'
import Modal from '../../components/Modal'
import { daysSince, formatShortDate, isPastVisit } from '../../utils/visits'
import { whatsappLink } from '../../utils/whatsapp'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

/** "Sumido": última visita há mais de N dias e nada agendado pela frente. */
type AwayFilter = 'all' | 30 | 60

interface VisitInfo {
  lastVisit: string | null
  hasUpcoming: boolean
}

export default function Clients() {
  const [search, setSearch] = useState('')
  const [away, setAway] = useState<AwayFilter>('all')
  const { data: allClients, isLoading } = useClients(search)
  const { data: appointments } = useAllAppointments()

  const visitsByClient = useMemo(() => {
    const now = new Date()
    const info = new Map<number, VisitInfo>()
    for (const a of appointments ?? []) {
      const clientId = a.pet?.client_id
      if (clientId === undefined || a.status === 'cancelled') continue
      const v = info.get(clientId) ?? { lastVisit: null, hasUpcoming: false }
      if (isPastVisit(a, now)) {
        if (!v.lastVisit || a.scheduled_at > v.lastVisit) v.lastVisit = a.scheduled_at
      } else {
        v.hasUpcoming = true
      }
      info.set(clientId, v)
    }
    return info
  }, [appointments])

  const clients = useMemo(() => {
    if (away === 'all') return allClients
    return (allClients ?? [])
      .filter((c) => {
        const v = visitsByClient.get(c.id)
        return !!v?.lastVisit && !v.hasUpcoming && daysSince(v.lastVisit) > away
      })
      .sort((a, b) => visitsByClient.get(a.id)!.lastVisit!.localeCompare(visitsByClient.get(b.id)!.lastVisit!))
  }, [allClients, away, visitsByClient])

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Clientes</h1>
          <p className="mt-1 text-sm text-muted">Donos dos pets cadastrados no petshop.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
        >
          <Plus size={16} /> Novo cliente
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-72">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            placeholder="Buscar por nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-surface p-1 text-sm">
          {([
            ['all', 'Todos'],
            [30, 'Sumidos +30 dias'],
            [60, 'Sumidos +60 dias'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setAway(value)}
              className={`rounded-md px-3 py-1 ${away === value ? 'bg-accent text-accent-foreground' : 'text-muted hover:text-foreground'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {away !== 'all' && (
        <p className="mt-2 text-sm text-muted">
          Clientes que não aparecem há mais de {away} dias e não têm nada agendado. Os mais antigos primeiro.
        </p>
      )}

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
              {away !== 'all'
                ? 'Nenhum cliente sumido. 🎉'
                : search
                  ? 'Nenhum cliente encontrado.'
                  : 'Nenhum cliente cadastrado ainda.'}
            </p>
            {!search && away === 'all' && (
              <button onClick={() => setShowForm(true)} className="text-sm font-medium text-accent hover:underline">
                Cadastrar o primeiro cliente
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((c) => (
              <div
                key={c.id}
                className="flex flex-col rounded-xl border border-border bg-surface p-4 transition hover:border-accent hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/25 text-sm font-semibold text-gold-foreground">
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
                    {away !== 'all' && visitsByClient.get(c.id)?.lastVisit && (
                      <p className="mt-1 text-xs font-medium text-gold-foreground">
                        Última visita {formatShortDate(visitsByClient.get(c.id)!.lastVisit!)} (há{' '}
                        {daysSince(visitsByClient.get(c.id)!.lastVisit!)} dias)
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-1">
                  {away !== 'all' && (
                    <a
                      href={whatsappLink(c.phone, `Oi, ${c.name.split(' ')[0]}! Tudo bem? Aqui é do Pet Encanto. Faz um tempinho que não vemos seu pet por aqui, que tal agendar um banho? 🐾`)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-sage-foreground hover:bg-sage/15"
                    >
                      <MessageCircle size={15} /> Chamar
                    </a>
                  )}
                  <Link
                    to={`/admin/clients/${c.id}`}
                    className="flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/10"
                  >
                    Ver detalhes <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
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
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
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
