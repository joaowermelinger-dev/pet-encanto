import { useEffect, useState, type FormEvent } from 'react'
import { useShopInfo, useUpdateShopInfo } from '../../hooks/useShopInfo'
import { ApiError } from '../../api/client'

interface FormState {
  shop_name: string
  address: string
  phone: string
  whatsapp: string
  email: string
  instagram_url: string
  opening_hours: string
}

const EMPTY_FORM: FormState = {
  shop_name: '',
  address: '',
  phone: '',
  whatsapp: '',
  email: '',
  instagram_url: '',
  opening_hours: '',
}

/** Dados do petshop (contato/localização/horário) exibidos na landing page. */
export default function ShopInfoForm() {
  const { data: shopInfo, isLoading } = useShopInfo()
  const updateShopInfo = useUpdateShopInfo()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!shopInfo) return
    setForm({
      shop_name: shopInfo.shop_name,
      address: shopInfo.address,
      phone: shopInfo.phone,
      whatsapp: shopInfo.whatsapp ?? '',
      email: shopInfo.email ?? '',
      instagram_url: shopInfo.instagram_url ?? '',
      opening_hours: shopInfo.opening_hours,
    })
  }, [shopInfo])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    try {
      await updateShopInfo.mutateAsync({
        shop_name: form.shop_name,
        address: form.address,
        phone: form.phone,
        whatsapp: form.whatsapp || null,
        email: form.email || null,
        instagram_url: form.instagram_url || null,
        opening_hours: form.opening_hours,
      })
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao salvar os dados do petshop.')
    }
  }

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl border border-border bg-surface-muted" />
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm">
        Nome do petshop
        <input
          required
          value={form.shop_name}
          onChange={(e) => setForm({ ...form, shop_name: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      <label className="text-sm">
        Endereço
        <input
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Rua, número, bairro, cidade"
          className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="text-sm sm:flex-1">
          Telefone
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="text-sm sm:flex-1">
          WhatsApp (com DDD, opcional)
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="Ex.: 11999999999"
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </label>
      </div>
      <p className="-mt-1 text-xs text-muted">
        Preenchendo o WhatsApp, o botão "Agende pelo WhatsApp" aparece na landing page.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="text-sm sm:flex-1">
          E-mail (opcional)
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </label>
        <label className="text-sm sm:flex-1">
          Instagram (link, opcional)
          <input
            value={form.instagram_url}
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
            placeholder="https://instagram.com/..."
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
        </label>
      </div>
      <label className="text-sm">
        Horário de funcionamento
        <textarea
          value={form.opening_hours}
          onChange={(e) => setForm({ ...form, opening_hours: e.target.value })}
          placeholder="Ex.: Seg a Sex, 9h às 18h · Sáb, 9h às 13h"
          rows={2}
          className="mt-1 block w-full resize-none rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && <p className="text-sm text-sage-foreground">Dados salvos.</p>}
      <div className="mt-1 flex justify-end">
        <button
          type="submit"
          disabled={updateShopInfo.isPending}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {updateShopInfo.isPending ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
