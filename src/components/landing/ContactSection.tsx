import { useQuery } from '@tanstack/react-query'
import { getPublicShopInfo } from '../../api/public'

export default function ContactSection() {
  const { data } = useQuery({ queryKey: ['public', 'shop-info'], queryFn: getPublicShopInfo })

  return (
    <section id="contato" className="bg-surface-muted py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-2xl font-semibold">Contato & localização</h2>
        <div className="mt-6 grid grid-cols-1 gap-2 text-muted sm:grid-cols-2">
          <p>
            <strong className="text-foreground">Endereço:</strong> {data?.address ?? 'carregando…'}
          </p>
          <p>
            <strong className="text-foreground">Telefone:</strong> {data?.phone ?? 'carregando…'}
          </p>
          <p>
            <strong className="text-foreground">Horário:</strong> {data?.opening_hours ?? 'carregando…'}
          </p>
          {data?.whatsapp && (
            <p>
              <strong className="text-foreground">WhatsApp:</strong> {data.whatsapp}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
