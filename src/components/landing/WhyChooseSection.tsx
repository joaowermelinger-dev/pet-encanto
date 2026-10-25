import { Award, Clock, Heart, ShieldCheck, Sparkles, Users } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const REASONS = [
  { icon: Heart, title: 'Carinho no atendimento', description: 'Cada pet é tratado com paciência e atenção individual.' },
  { icon: Users, title: 'Profissionais preparados', description: 'Equipe experiente e sempre atualizada em boas práticas.' },
  { icon: ShieldCheck, title: 'Ambiente seguro e confortável', description: 'Espaço limpo e pensado pro bem-estar do seu pet.' },
  { icon: Sparkles, title: 'Produtos de qualidade', description: 'Shampoos e produtos selecionados pra pele e pelagem.' },
  { icon: Award, title: 'Atendimento personalizado', description: 'Cada serviço se adapta ao jeito e à necessidade do seu pet.' },
  { icon: Clock, title: 'Pontualidade', description: 'Seu tempo é importante — horário combinado é horário cumprido.' },
]

export default function WhyChooseSection() {
  return (
    <section id="diferenciais" className="px-3 sm:px-5">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-sage-deep py-20 sm:rounded-[3rem] sm:py-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 size-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-gold/10" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Diferenciais"
            title="Por que confiar a nós o bem-estar do seu melhor amigo?"
            tone="dark"
          />

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {REASONS.map(({ icon: Icon, title, description }, index) => (
                <Reveal key={title} delay={index * 70}>
                  <div className="flex h-full gap-4 rounded-3xl bg-white/[0.07] p-5 sm:block ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/[0.11]">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gold text-gold-foreground">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white sm:mt-4">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200} className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <div className="absolute left-0 top-0 aspect-square w-[68%] overflow-hidden rounded-full bg-gradient-to-br from-gold/70 to-gold/30 shadow-soft-lg ring-8 ring-white/10">
                <img src="/why-choose-dog.png" alt="Cachorro feliz" className="size-full scale-110 object-contain object-bottom" />
              </div>
              <div className="absolute bottom-0 right-0 aspect-square w-[52%] overflow-hidden rounded-full bg-gradient-to-br from-[#e9e1d3] to-[#cfc4b0] shadow-soft-lg ring-8 ring-sage-deep">
                <img src="/why-choose-cat.png" alt="Gato feliz" className="size-full scale-110 object-contain object-bottom" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
