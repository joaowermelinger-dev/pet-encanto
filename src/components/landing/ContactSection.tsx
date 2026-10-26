import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function ContactSection() {
  const { data } = usePublicShopInfo()
  const mapsLink = data?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`
    : undefined

  const cards = [
    { icon: MapPin, title: 'Endereço', lines: [data?.address ?? 'carregando…'] },
    {
      icon: Phone,
      title: 'Telefone',
      lines: [data?.phone ?? 'carregando…', ...(data?.whatsapp ? [`WhatsApp: ${data.whatsapp}`] : [])],
    },
    { icon: Clock, title: 'Horário', lines: [data?.opening_hours ?? 'carregando…'] },
  ]

  return (
    <section id="contato" className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Localização"
          title="Estamos esperando por vocês"
          subtitle="Vem conhecer o espaço e tirar suas dúvidas — será um prazer receber você e seu pet."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {cards.map(({ icon: Icon, title, lines }, index) => (
            <Reveal key={title} delay={index * 80}>
              <div className="flex h-full items-start gap-4 rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{title}</p>
                  {lines.map((line) => (
                    <p key={line} className="mt-1 font-semibold leading-snug">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {mapsLink && (
          <Reveal delay={240} className="mt-10 flex justify-center">
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-accent bg-transparent px-7 py-3.5 font-bold text-accent hover:bg-accent hover:text-accent-foreground sm:w-auto"
            >
              <Navigation size={17} /> Como chegar
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
