import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import PawDecor from './PawDecor'
import Reveal from './Reveal'

export default function ContactSection() {
  const { data } = usePublicShopInfo()
  const mapsLink = data?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`
    : undefined

  return (
    <section id="contato" className="relative overflow-hidden py-16 sm:py-24">
      <PawDecor />
      <div className="relative mx-auto max-w-5xl px-4">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Estamos esperando por vocês</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Vem conhecer o espaço e tirar suas dúvidas — será um prazer receber você e seu pet.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Reveal delay={0}>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-medium">Endereço</p>
                <p className="mt-0.5 text-sm text-muted">{data?.address ?? 'carregando…'}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <Phone size={18} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-medium">Telefone</p>
                <p className="mt-0.5 text-sm text-muted">{data?.phone ?? 'carregando…'}</p>
                {data?.whatsapp && <p className="text-sm text-muted">WhatsApp: {data.whatsapp}</p>}
              </div>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <Clock size={18} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <p className="font-medium">Horário</p>
                <p className="mt-0.5 text-sm text-muted">{data?.opening_hours ?? 'carregando…'}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {mapsLink && (
          <Reveal delay={240} className="mt-8 flex justify-center">
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
            >
              <Navigation size={16} /> Como chegar
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
