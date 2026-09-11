import { useState, type FormEvent } from 'react'
import { Clock, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useCreateService, useDeleteService, useServices, useUpdateService } from '../../hooks/useServices'
import type { Service } from '../../types'
import { ApiError } from '../../api/client'
import Modal from '../Modal'

interface FormState {
  name: string
  description: string
  duration_minutes: string
  price: string
  is_public: boolean
  is_active: boolean
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  duration_minutes: '30',
  price: '',
  is_public: false,
  is_active: true,
}

function formatPrice(price: string): string {
  return Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Catálogo de tipos de serviço (nome, preço base, duração, visível no site). */
export default function ServiceCatalog() {
  const { data: services, isLoading } = useServices()
  const createService = useCreateService()
  const updateService = useUpdateService()
  const deleteService = useDeleteService()

  const [editing, setEditing] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError(null)
    setShowForm(true)
  }

  function openEdit(service: Service) {
    setEditing(service)
    setForm({
      name: service.name,
      description: service.description ?? '',
      duration_minutes: String(service.duration_minutes),
      price: String(service.price),
      is_public: service.is_public,
      is_active: service.is_active,
    })
    setError(null)
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const input = {
      name: form.name,
      description: form.description || null,
      duration_minutes: Number(form.duration_minutes),
      price: Number(form.price),
      is_public: form.is_public,
      is_active: form.is_active,
    }
    try {
      if (editing) {
        await updateService.mutateAsync({ id: editing.id, input })
      } else {
        await createService.mutateAsync(input)
      }
      setShowForm(false)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao salvar serviço.')
    }
  }

  async function handleTogglePublic(service: Service) {
    await updateService.mutateAsync({
      id: service.id,
      input: {
        name: service.name,
        description: service.description,
        duration_minutes: service.duration_minutes,
        price: Number(service.price),
        is_public: !service.is_public,
        is_active: service.is_active,
      },
    })
  }

  async function handleDelete(service: Service) {
    if (!confirm(`Apagar o serviço "${service.name}"?`)) return
    try {
      await deleteService.mutateAsync(service.id)
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Erro ao apagar serviço.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Catálogo de serviços</h2>
          <p className="mt-1 text-sm text-muted">
            Tipos de serviço disponíveis para os atendimentos. Marque "Visível no site" para aparecer na landing page.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
        >
          <Plus size={16} /> Novo tipo
        </button>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-surface-muted" />
            ))}
          </div>
        ) : !services || services.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
            <Sparkles size={26} className="text-muted" />
            <p className="text-sm text-muted">Nenhum tipo de serviço cadastrado ainda.</p>
            <button onClick={openCreate} className="text-sm font-medium text-accent hover:underline">
              Cadastrar o primeiro
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.id} className="flex flex-col rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{s.name}</p>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEdit(s)}
                      aria-label={`Editar ${s.name}`}
                      className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-accent"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(s)}
                      aria-label={`Apagar ${s.name}`}
                      className="rounded-lg p-1.5 text-muted hover:bg-surface-muted hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <Clock size={13} /> {s.duration_minutes} min · {formatPrice(s.price)}
                </p>
                {!s.is_active && <span className="mt-2 w-fit rounded bg-surface-muted px-2 py-0.5 text-xs text-muted">Inativo</span>}
                <label className="mt-3 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={s.is_public} onChange={() => handleTogglePublic(s)} className="accent-accent" />
                  Visível no site
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <Modal title={editing ? 'Editar tipo de serviço' : 'Novo tipo de serviço'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-sm">
              Nome
              <input
                required
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="text-sm">
              Descrição (opcional)
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <div className="flex gap-3">
              <label className="flex-1 text-sm">
                Duração (min)
                <input
                  type="number"
                  min={5}
                  step={5}
                  required
                  value={form.duration_minutes}
                  onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                />
              </label>
              <label className="flex-1 text-sm">
                Preço base (R$)
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                className="accent-accent"
              />
              Visível no site (landing page)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="accent-accent"
              />
              Ativo (aparece para escolher num atendimento)
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground">
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createService.isPending || updateService.isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
              >
                {createService.isPending || updateService.isPending ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
