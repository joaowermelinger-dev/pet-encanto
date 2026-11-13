import { useState } from 'react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import SectionHeading from './SectionHeading'

interface Service {
  name: string
  description: string
  /** Texto do botão (o serviço que vai na mensagem do WhatsApp é `name`). */
  cta: string
}

// Lista fixa, definida pelo dono do petshop — não vem do catálogo do admin
// (que serve só pros valores usados internamente nos atendimentos). Sem
// preços aqui: o cliente combina o valor direto pelo WhatsApp. O primeiro
// serviço de cada aba é o destaque (card escuro à esquerda).
const CATEGORIES: { label: string; image: string; items: Service[] }[] = [
  {
    label: 'Banho',
    image: '/servico-banho.webp',
    items: [
      { name: 'Banho', description: 'Com produtos suaves e hidratantes.', cta: 'Agendar banho' },
      { name: 'Banho dermatológico', description: 'Para peles sensíveis, com produtos indicados.', cta: 'Agendar banho' },
      { name: 'Hidratação', description: 'Nutre o pelo e deixa macio e brilhante.', cta: 'Agendar hidratação' },
      { name: 'Cromoterapia', description: 'Luzes coloridas para relaxar e acalmar.', cta: 'Agendar cromoterapia' },
    ],
  },
  {
    label: 'Tosa',
    image: '/servico-tosa.webp',
    items: [
      { name: 'Tosa geral', description: 'Corte completo, com o pelo na medida certa.', cta: 'Agendar tosa' },
      { name: 'Tosa da raça', description: 'Corte no padrão da raça, com atenção aos detalhes.', cta: 'Agendar tosa' },
      { name: 'Tosa comercial', description: 'Aparada rápida para manter o pelo em dia.', cta: 'Agendar tosa' },
    ],
  },
  {
    label: 'Extras',
    image: '/servico-extras.webp',
    items: [
      { name: 'Taxi Dog', description: 'Buscamos e levamos seu pet.', cta: 'Agendar taxi' },
      { name: 'Corte de unha', description: 'Rápido e seguro.', cta: 'Agendar corte' },
      { name: 'Limpeza de orelhas', description: 'Higiene para evitar infecções e desconforto.', cta: 'Agendar limpeza' },
    ],
  },
]

export default function ServicesSection() {
  const { data: shopInfo } = usePublicShopInfo()
  const [tab, setTab] = useState(0)

  const { items, image } = CATEGORIES[tab]
  const [featured, ...rest] = items

  const linkFor = (service: Service) =>
    shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, `Olá! Gostaria de agendar: ${service.name}.`) : '#contato'
  const linkProps = shopInfo?.whatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <section id="servicos" className="pb-16 pt-12 sm:pb-24 sm:pt-14">
      <div className="mx-auto max-w-[88rem] px-5 lg:px-10">
        <SectionHeading title="Serviços" subtitle="Os valores são combinados pelo WhatsApp." />

        <div role="tablist" aria-label="Categorias de serviços" className="mt-8 flex gap-2 border-b border-border pb-3">
          {CATEGORIES.map((category, index) => {
            const active = index === tab
            return (
              <button
                key={category.label}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(index)}
                className={`rounded-lg px-5 py-2 text-base font-bold sm:text-lg ${
                  active ? 'bg-accent text-accent-foreground' : 'text-foreground/80 hover:bg-surface-muted'
                }`}
              >
                {category.label}
              </button>
            )
          })}
        </div>

        <div key={tab} role="tabpanel" className="landing-fade mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[5fr_6fr] lg:gap-8">
          <div className="relative flex flex-col overflow-hidden rounded-lg bg-accent text-accent-foreground sm:min-h-[22rem] sm:flex-row">
            <img
              src={image}
              alt=""
              className="aspect-[4/3] w-full object-cover sm:absolute sm:inset-y-0 sm:right-0 sm:aspect-auto sm:h-full sm:w-[60%] sm:[mask-image:linear-gradient(to_right,transparent,black_22%)]"
            />
            {/* formas verdes */}
            <svg aria-hidden viewBox="0 0 300 80" className="absolute -top-2 left-[6%] hidden w-[45%] text-sage/70 sm:block">
              <path fill="currentColor" d="M0 0 H300 C270 40 230 70 170 60 C110 50 60 75 20 50 C5 40 0 20 0 0 Z" />
            </svg>
            <svg aria-hidden viewBox="0 0 400 90" className="absolute -bottom-2 left-0 w-full text-sage/60 sm:w-[55%]">
              <path fill="currentColor" d="M0 90 V40 C60 10 120 20 170 45 C220 70 290 30 340 50 C370 62 390 80 400 90 Z" />
            </svg>
            <div className="relative flex flex-col p-6 pb-12 sm:max-w-[18rem] sm:justify-center sm:p-8">
              <h3 className="font-display text-4xl font-semibold sm:text-5xl">{featured.name}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-accent-foreground/85">{featured.description}</p>
              <a
                href={linkFor(featured)}
                {...linkProps}
                className="group mt-6 inline-flex items-center gap-2 self-start rounded-md bg-background px-5 py-3 font-bold text-foreground hover:bg-surface-muted"
              >
                {featured.cta}
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>

          <ul className="flex flex-col gap-4">
            {rest.map((service) => (
              <li key={service.name}>
                <a
                  href={linkFor(service)}
                  {...linkProps}
                  className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 shadow-[0_2px_10px_rgba(60,40,20,0.06)] hover:border-accent/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6"
                >
                  <span>
                    <span className="block font-display text-xl font-semibold sm:text-2xl">{service.name}</span>
                    <span className="mt-1 block text-pretty text-muted">{service.description}</span>
                  </span>
                  <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-md border border-foreground/70 px-4 py-2.5 text-sm font-bold group-hover:bg-foreground group-hover:text-background sm:self-auto">
                    {service.cta}
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
