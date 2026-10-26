import { useState } from 'react'
import { ArrowRight, Award, Car, Droplet, Droplets, Ear, Palette, Scissors, Sparkles, Stethoscope, Wind, type LucideIcon } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

interface Service {
  icon: LucideIcon
  name: string
  description: string
  /** Texto do botão (o serviço que vai na mensagem do WhatsApp é `name`). */
  cta: string
}

// Lista fixa, definida pelo dono do petshop — não vem do catálogo do admin
// (que serve só pros valores usados internamente nos atendimentos). Sem
// preços aqui: o cliente combina o valor direto pelo WhatsApp. O primeiro
// serviço de cada aba é o destaque (card escuro à esquerda).
const CATEGORIES: { label: string; items: Service[] }[] = [
  {
    label: 'Banho',
    items: [
      { icon: Droplets, name: 'Banho', description: 'Produtos suaves e hidratantes, do jeitinho que seu pet merece.', cta: 'Agendar Banho' },
      { icon: Stethoscope, name: 'Banho dermatológico', description: 'Cuidado especial pra peles sensíveis, com produtos indicados.', cta: 'Agendar Banho' },
      { icon: Droplet, name: 'Hidratação', description: 'Nutrição profunda pra um pelo macio e brilhante.', cta: 'Agendar Hidratação' },
      { icon: Palette, name: 'Cromoterapia', description: 'Terapia com luzes coloridas pra relaxar e acalmar.', cta: 'Agendar Cromoterapia' },
    ],
  },
  {
    label: 'Tosa',
    items: [
      { icon: Scissors, name: 'Tosa geral', description: 'Corte completo, deixando o pelo na medida certa.', cta: 'Agendar Tosa' },
      { icon: Award, name: 'Tosa da raça', description: 'Corte no padrão da raça, com atenção aos detalhes.', cta: 'Agendar Tosa' },
      { icon: Wind, name: 'Tosa comercial', description: 'Aparada rápida pra manter o visual sempre em dia.', cta: 'Agendar Tosa' },
    ],
  },
  {
    label: 'Extras',
    items: [
      { icon: Car, name: 'Taxi Dog', description: 'Buscamos e levamos seu pet com todo cuidado.', cta: 'Agendar Taxi' },
      { icon: Sparkles, name: 'Corte de unha', description: 'Cuidado rápido e seguro, sem estresse pro seu pet.', cta: 'Agendar Corte' },
      { icon: Ear, name: 'Limpeza de orelhas', description: 'Higiene cuidadosa pra evitar infecções e desconforto.', cta: 'Agendar Limpeza' },
    ],
  },
]

export default function ServicesSection() {
  const { data: shopInfo } = usePublicShopInfo()
  const [tab, setTab] = useState(0)

  const { items } = CATEGORIES[tab]
  const [featured, ...rest] = items
  const FeaturedIcon = featured.icon

  const linkFor = (service: Service) =>
    shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, `Olá! Gostaria de agendar: ${service.name}.`) : '#contato'
  const linkProps = shopInfo?.whatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <section id="servicos" className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Serviços"
          title="Serviços para deixar seu pet ainda mais feliz"
          subtitle="Conheça os cuidados que oferecemos. Valores combinados direto pelo WhatsApp."
        />

        <Reveal delay={80}>
          <div role="tablist" aria-label="Categorias de serviços" className="mt-10 flex flex-wrap justify-center gap-2 sm:mt-12">
            {CATEGORIES.map((category, index) => {
              const active = index === tab
              return (
                <button
                  key={category.label}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(index)}
                  className={`rounded-full border px-5 py-2.5 text-[15px] font-bold sm:px-6 sm:py-3 ${
                    active
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-transparent text-foreground hover:border-foreground'
                  }`}
                >
                  {category.label} <span className="font-semibold opacity-60">{category.items.length}</span>
                </button>
              )
            })}
          </div>

          <div role="tabpanel" className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[5fr_7fr] lg:gap-6">
            <div className="flex flex-col gap-5 rounded-[1.75rem] bg-foreground p-4 text-background sm:p-5 lg:min-h-[26rem]">
              <div
                aria-hidden
                className="relative flex min-h-40 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[repeating-linear-gradient(135deg,#4a3320_0_12px,#422c1a_12px_24px)]"
              >
                <span className="flex size-20 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-soft-lg sm:size-24">
                  <FeaturedIcon size={38} />
                </span>
              </div>
              <div className="px-2 pb-2">
                <h3 className="font-display text-3xl font-semibold">{featured.name}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-background/80">{featured.description}</p>
                <a
                  href={linkFor(featured)}
                  {...linkProps}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-background px-6 py-3 text-[15px] font-bold text-foreground hover:bg-surface-muted"
                >
                  {featured.cta} <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {rest.map((service, index) => (
                <a
                  key={service.name}
                  href={linkFor(service)}
                  {...linkProps}
                  className="group grid flex-1 grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 rounded-[1.25rem] border border-border bg-surface px-5 py-5 hover:border-foreground hover:bg-white sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-5 sm:px-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-[0.875rem] bg-surface-muted font-display text-base font-semibold text-gold-foreground sm:size-12">
                    {String(index + 2).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-semibold">{service.name}</span>
                    <span className="mt-1 block text-pretty text-[15px] leading-relaxed text-muted">{service.description}</span>
                  </span>
                  <span className="col-start-2 inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-bold sm:col-start-auto">
                    {service.cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
