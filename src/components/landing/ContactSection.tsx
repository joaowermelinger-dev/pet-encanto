import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import ButtonLink from './ButtonLink'
import SectionHeading from './SectionHeading'

export default function ContactSection() {
  const { data } = usePublicShopInfo()
  const mapsLink = data?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`
    : undefined

  const rows = [
    { label: 'Endereço', value: data?.address },
    { label: 'Telefone', value: data?.phone },
    { label: 'WhatsApp', value: data?.whatsapp },
    { label: 'Horário', value: data?.opening_hours },
  ].filter((row) => row.value)

  return (
    <section id="contato" className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-[88rem] gap-8 px-5 lg:px-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div>
          <SectionHeading title="Onde estamos" subtitle="Venha conhecer o espaço e tirar suas dúvidas." />
          {mapsLink && (
            <ButtonLink href={mapsLink} external variant="outline" className="mt-6 w-full sm:w-auto">
              Como chegar
            </ButtonLink>
          )}
        </div>

        <dl className="divide-y divide-border border-y border-border">
          {data ? (
            rows.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <dt className="font-bold">{row.label}</dt>
                <dd className="text-muted">{row.value}</dd>
              </div>
            ))
          ) : (
            <p className="py-4 text-muted">carregando…</p>
          )}
        </dl>
      </div>
    </section>
  )
}
