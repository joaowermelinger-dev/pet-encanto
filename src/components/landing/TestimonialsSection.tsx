import { MessageCircleHeart } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

/**
 * Espaço reservado pros depoimentos reais dos clientes — de propósito sem
 * nomes/fotos/citações inventadas (isso seria propaganda enganosa). Assim
 * que o petshop reunir depoimentos de verdade, essa seção vira uma lista de
 * cards com foto, nome e avaliação.
 */
export default function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-3xl px-5">
        <SectionHeading eyebrow="Depoimentos" title="Nossos clientes" />
        <Reveal delay={100}>
          <div className="relative mx-auto mt-10 flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-border bg-surface px-8 py-12 text-center shadow-soft">
            <span aria-hidden className="absolute -top-7 left-1/2 -translate-x-1/2 font-display text-7xl leading-none text-gold">
              “
            </span>
            <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold-foreground">
              <MessageCircleHeart size={26} />
            </span>
            <p className="text-pretty text-muted">Em breve, depoimentos reais de quem já confia no cuidado da Pet Encanto.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
