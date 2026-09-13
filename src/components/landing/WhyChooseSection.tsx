import { Award, Clock, Heart, ShieldCheck, Sparkles, Users } from 'lucide-react'
import PawDecor from './PawDecor'
import Reveal from './Reveal'

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
    <section id="diferenciais" className="relative overflow-hidden bg-surface-muted py-16 sm:py-24">
      <PawDecor />
      <div className="relative mx-auto max-w-5xl px-4">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Por que confiar a nós o bem-estar do seu melhor amigo?
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="flex flex-col gap-3">
            {REASONS.map(({ icon: Icon, title, description }, index) => (
              <Reveal key={title} delay={index * 70}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft sm:items-center">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-foreground">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="mt-0.5 text-sm text-muted">{description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-md">
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gold/25 via-sage/20 to-transparent blur-2xl" />

            <div className="absolute left-0 top-0 aspect-square w-[68%] overflow-hidden rounded-full bg-gradient-to-br from-gold/30 to-gold/10 shadow-soft-lg">
              <img
                src="/why-choose-dog.png"
                alt="Cachorro feliz"
                className="size-full scale-110 object-contain object-bottom"
              />
            </div>

            <div className="absolute bottom-0 right-0 aspect-square w-[52%] overflow-hidden rounded-full bg-gradient-to-br from-sage/30 to-sage/10 shadow-soft-lg ring-4 ring-background">
              <img
                src="/why-choose-cat.png"
                alt="Gato feliz"
                className="size-full scale-110 object-contain object-bottom"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
