import { MessageCircleHeart } from 'lucide-react'
import PawDecor from './PawDecor'
import Reveal from './Reveal'

/**
 * Espaço reservado pros depoimentos reais dos clientes — de propósito sem
 * nomes/fotos/citações inventadas (isso seria propaganda enganosa). Assim
 * que o petshop reunir depoimentos de verdade, essa seção vira uma lista de
 * cards com foto, nome e avaliação.
 */
export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <PawDecor />
      <Reveal className="relative mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Nossos clientes</h2>
        <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface p-10">
          <MessageCircleHeart size={32} className="text-muted/60" />
          <p className="text-sm text-muted">
            Em breve, depoimentos reais de quem já confia no cuidado da Pet Encanto.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
