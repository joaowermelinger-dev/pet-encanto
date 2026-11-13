import SectionHeading from './SectionHeading'

const REASONS = [
  { title: 'Carinho no atendimento', description: 'Cada cachorro é tratado com paciência e atenção individual.' },
  { title: 'Profissionais preparados', description: 'Equipe experiente e sempre atualizada em boas práticas.' },
  { title: 'Ambiente seguro e confortável', description: 'Espaço limpo e pensado para o bem-estar do seu cachorro.' },
  { title: 'Produtos de qualidade', description: 'Shampoos e produtos selecionados para pele e pelagem.' },
  { title: 'Atendimento personalizado', description: 'Cada serviço se adapta ao jeito e à necessidade de cada um.' },
  { title: 'Pontualidade', description: 'Horário combinado é horário cumprido.' },
]

export default function WhyChooseSection() {
  return (
    <section id="diferenciais" className="bg-sage-deep py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title="Como cuidamos" tone="dark" />

        <ol className="mt-10 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          {REASONS.map(({ title, description }, index) => (
            <li key={title} className="flex gap-5 border-t border-white/20 py-5">
              <span className="w-6 shrink-0 font-display text-lg text-gold">{index + 1}</span>
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 leading-relaxed text-white/75">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
