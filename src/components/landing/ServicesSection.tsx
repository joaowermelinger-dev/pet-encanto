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
const CATEGORIES: { label: string; items: Service[] }[] = [
  {
    label: 'Banho',
    items: [
      { name: 'Banho', description: 'Com produtos suaves e hidratantes.', cta: 'Agendar banho' },
      { name: 'Banho dermatológico', description: 'Para peles sensíveis, com produtos indicados.', cta: 'Agendar banho' },
      { name: 'Hidratação', description: 'Nutre o pelo e deixa macio e brilhante.', cta: 'Agendar hidratação' },
      { name: 'Cromoterapia', description: 'Luzes coloridas para relaxar e acalmar.', cta: 'Agendar cromoterapia' },
    ],
  },
  {
    label: 'Tosa',
    items: [
      { name: 'Tosa geral', description: 'Corte completo, com o pelo na medida certa.', cta: 'Agendar tosa' },
      { name: 'Tosa da raça', description: 'Corte no padrão da raça, com atenção aos detalhes.', cta: 'Agendar tosa' },
      { name: 'Tosa comercial', description: 'Aparada rápida para manter o pelo em dia.', cta: 'Agendar tosa' },
    ],
  },
  {
    label: 'Extras',
    items: [
      { name: 'Taxi Dog', description: 'Buscamos e levamos seu cachorro.', cta: 'Agendar taxi' },
      { name: 'Corte de unha', description: 'Rápido e seguro.', cta: 'Agendar corte' },
      { name: 'Limpeza de orelhas', description: 'Higiene para evitar infecções e desconforto.', cta: 'Agendar limpeza' },
    ],
  },
]

export default function ServicesSection() {
  const { data: shopInfo } = usePublicShopInfo()
  const [tab, setTab] = useState(0)

  const { items } = CATEGORIES[tab]
  const [featured, ...rest] = items

  const linkFor = (service: Service) =>
    shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, `Olá! Gostaria de agendar: ${service.name}.`) : '#contato'
  const linkProps = shopInfo?.whatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <section id="servicos" className="border-t border-border py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title="Serviços" subtitle="Os valores são combinados pelo WhatsApp." />

        <div role="tablist" aria-label="Categorias de serviços" className="mt-8 flex gap-6 border-b border-border">
          {CATEGORIES.map((category, index) => {
            const active = index === tab
            return (
              <button
                key={category.label}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(index)}
                className={`-mb-px border-b-2 pb-3 text-base font-bold sm:text-lg ${
                  active ? 'border-accent text-foreground' : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {category.label}
              </button>
            )
          })}
        </div>

        <div role="tabpanel" className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[5fr_7fr] lg:gap-8">
          <div className="flex flex-col justify-end rounded-lg bg-foreground p-6 text-background sm:p-8 lg:min-h-[20rem]">
            <h3 className="font-display text-3xl font-semibold sm:text-4xl">{featured.name}</h3>
            <p className="mt-2 text-pretty leading-relaxed text-background/80">{featured.description}</p>
            <a
              href={linkFor(featured)}
              {...linkProps}
              className="mt-6 inline-flex self-start rounded-md bg-background px-5 py-3 font-bold text-foreground hover:bg-surface-muted"
            >
              {featured.cta} →
            </a>
          </div>

          <ul className="divide-y divide-border border-y border-border">
            {rest.map((service) => (
              <li key={service.name}>
                <a
                  href={linkFor(service)}
                  {...linkProps}
                  className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span>
                    <span className="block font-display text-xl font-semibold">{service.name}</span>
                    <span className="mt-1 block text-pretty text-muted">{service.description}</span>
                  </span>
                  <span className="whitespace-nowrap text-sm font-bold text-accent group-hover:underline underline-offset-4">
                    {service.cta} →
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
