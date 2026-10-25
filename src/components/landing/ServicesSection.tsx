import { ArrowRight, Award, Car, Droplet, Droplets, Ear, Palette, Scissors, Sparkles, Stethoscope, Wind } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

// Lista fixa, definida pelo dono do petshop — não vem do catálogo do admin
// (que serve só pros valores usados internamente nos atendimentos). Sem
// preços aqui: o cliente combina o valor direto pelo WhatsApp.
const SERVICES = [
  { icon: Droplets, name: 'Banho', description: 'Produtos suaves e hidratantes, do jeitinho que seu pet merece.' },
  { icon: Stethoscope, name: 'Banho dermatológico', description: 'Cuidado especial pra peles sensíveis, com produtos indicados.' },
  { icon: Palette, name: 'Cromoterapia', description: 'Terapia com luzes coloridas pra relaxar e acalmar.' },
  { icon: Car, name: 'Taxi Dog', description: 'Buscamos e levamos seu pet com todo cuidado.' },
  { icon: Scissors, name: 'Tosa geral', description: 'Corte completo, deixando o pelo na medida certa.' },
  { icon: Wind, name: 'Tosa comercial', description: 'Aparada rápida pra manter o visual sempre em dia.' },
  { icon: Award, name: 'Tosa da raça', description: 'Corte no padrão da raça, com atenção aos detalhes.' },
  { icon: Droplet, name: 'Hidratação', description: 'Nutrição profunda pra um pelo macio e brilhante.' },
  { icon: Sparkles, name: 'Corte de unha', description: 'Cuidado rápido e seguro, sem estresse pro seu pet.' },
  { icon: Ear, name: 'Limpeza de orelhas', description: 'Higiene cuidadosa pra evitar infecções e desconforto.' },
]

export default function ServicesSection() {
  const { data: shopInfo } = usePublicShopInfo()

  return (
    <section id="servicos" className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Serviços"
          title="Serviços para deixar seu pet ainda mais feliz"
          subtitle="Conheça os cuidados que oferecemos. Valores combinados direto pelo WhatsApp."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5">
          {SERVICES.map((service, index) => {
            const Icon = service.icon
            const link = shopInfo?.whatsapp
              ? whatsappLink(shopInfo.whatsapp, `Olá! Gostaria de agendar: ${service.name}.`)
              : '#contato'
            return (
              <Reveal key={service.name} delay={(index % 5) * 60}>
                <a
                  href={link}
                  target={shopInfo?.whatsapp ? '_blank' : undefined}
                  rel={shopInfo?.whatsapp ? 'noopener noreferrer' : undefined}
                  className="group flex h-full gap-4 rounded-3xl border border-border bg-surface p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-soft-lg lg:flex-col lg:p-6"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sage/15 text-sage-fg transition-colors duration-300 group-hover:bg-sage-deep group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-display text-lg font-semibold leading-snug lg:mt-1">{service.name}</span>
                    <span className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{service.description}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-bold text-accent transition-[gap] group-hover:gap-2.5">
                      Agendar {service.name.split(' ')[0]} <ArrowRight size={15} />
                    </span>
                  </span>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
