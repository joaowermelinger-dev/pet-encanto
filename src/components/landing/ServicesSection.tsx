import { ArrowRight, Award, Car, Droplet, Droplets, Ear, Palette, Scissors, Sparkles, Stethoscope, Wind } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import PawDecor from './PawDecor'
import Reveal from './Reveal'

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
    <section id="servicos" className="relative overflow-hidden py-16 sm:py-24">
      <PawDecor />
      <div className="relative mx-auto max-w-5xl px-4">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Serviços para deixar seu pet ainda mais feliz</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Conheça os cuidados que oferecemos. Valores combinados direto pelo WhatsApp.</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => {
            const Icon = service.icon
            const link = shopInfo?.whatsapp
              ? whatsappLink(shopInfo.whatsapp, `Olá! Gostaria de agendar: ${service.name}.`)
              : '#contato'
            return (
              <Reveal key={service.name} delay={index * 60}>
                <div className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-accent/40">
                  <span className="flex size-11 items-center justify-center rounded-full bg-sage/20 text-sage-foreground">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{service.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm text-muted">{service.description}</p>
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
      </div>
    </section>
  )
}
