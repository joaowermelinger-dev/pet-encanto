import { ArrowRight, Droplets, PawPrint, Scissors, ShieldPlus, Sparkles } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { usePublicServices } from '../../hooks/usePublicServices'
import { whatsappLink } from '../../utils/whatsapp'
import PawDecor from './PawDecor'
import Reveal from './Reveal'

// Ícone só decorativo — repete em ciclo, não tem relação com o serviço em si.
const ICONS = [Droplets, Scissors, Sparkles, ShieldPlus]

function formatPrice(price: string): string {
  return Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ServicesSection() {
  const { data: shopInfo } = usePublicShopInfo()
  const { data: services, isLoading } = usePublicServices()

  return (
    <section id="servicos" className="relative overflow-hidden py-16 sm:py-24">
      <PawDecor />
      <div className="relative mx-auto max-w-5xl px-4">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Serviços para deixar seu pet ainda mais feliz</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Conheça os cuidados que oferecemos.</p>
        </Reveal>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-52 animate-pulse rounded-2xl border border-border bg-surface-muted" />
            ))}
          </div>
        ) : !services || services.length === 0 ? (
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-12 text-center">
            <PawPrint size={26} className="text-muted" />
            <p className="text-sm text-muted">Em breve, nossos serviços aparecem aqui.</p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = ICONS[index % ICONS.length]
              const link = shopInfo?.whatsapp
                ? whatsappLink(shopInfo.whatsapp, `Olá! Gostaria de agendar: ${service.name}.`)
                : '#contato'
              return (
                <Reveal key={service.id} delay={index * 80}>
                  <div className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40">
                    <span className="flex size-11 items-center justify-center rounded-full bg-sage/20 text-sage-foreground">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold">{service.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm text-muted">
                      {service.description || `Duração aproximada: ${service.duration_minutes} min.`}
                    </p>
                    <p className="mt-3 text-sm font-medium text-gold-foreground">{formatPrice(service.price)}</p>
                    <a
                      href={link}
                      target={shopInfo?.whatsapp ? '_blank' : undefined}
                      rel={shopInfo?.whatsapp ? 'noopener noreferrer' : undefined}
                      className="mt-4 flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5"
                    >
                      Agendar {service.name.split(' ')[0]} <ArrowRight size={14} />
                    </a>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
