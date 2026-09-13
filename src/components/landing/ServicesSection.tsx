import { ArrowRight, Droplets, Scissors, ShieldPlus, Sparkles } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import PawDecor from './PawDecor'

const PLACEHOLDER_SERVICES = [
  {
    icon: Droplets,
    name: 'Banho Relaxante',
    description: 'Produtos suaves e hidratantes, do jeitinho que seu pet merece.',
    price: 'a partir de R$ 50',
  },
  {
    icon: Scissors,
    name: 'Tosa Completa',
    description: 'Corte na medida certa, com toda segurança e carinho.',
    price: 'a partir de R$ 70',
  },
  {
    icon: Sparkles,
    name: 'Tosa Higiênica',
    description: 'Cuidado nas áreas mais sensíveis, rápido e sem estresse.',
    price: 'a partir de R$ 40',
  },
  {
    icon: ShieldPlus,
    name: 'Consulta Veterinária',
    description: 'Acompanhamento de saúde com profissionais de confiança.',
    price: 'sob consulta',
  },
]

export default function ServicesSection() {
  const { data: shopInfo } = usePublicShopInfo()

  return (
    <section id="servicos" className="relative overflow-hidden py-16 sm:py-24">
      <PawDecor />
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Serviços para deixar seu pet ainda mais feliz</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Em breve com preços e horários atualizados pelo próprio petshop.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLACEHOLDER_SERVICES.map((service) => {
            const Icon = service.icon
            const link = shopInfo?.whatsapp
              ? whatsappLink(shopInfo.whatsapp, `Olá! Gostaria de agendar: ${service.name}.`)
              : '#contato'
            return (
              <div
                key={service.name}
                className="group flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-sage/20 text-sage-foreground">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{service.name}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted">{service.description}</p>
                <p className="mt-3 text-sm font-medium text-gold-foreground">{service.price}</p>
                <a
                  href={link}
                  target={shopInfo?.whatsapp ? '_blank' : undefined}
                  rel={shopInfo?.whatsapp ? 'noopener noreferrer' : undefined}
                  className="mt-4 flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5"
                >
                  Agendar {service.name.split(' ')[0]} <ArrowRight size={14} />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
