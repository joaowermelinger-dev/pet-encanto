import { Award, Clock, Heart, ShieldCheck, Sparkles, Users } from 'lucide-react'
import PawDecor from './PawDecor'

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
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Por que confiar a nós o bem-estar do seu melhor amigo?
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <span className="flex size-11 items-center justify-center rounded-full bg-gold/20 text-gold-foreground">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
