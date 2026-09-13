import { Heart, PawPrint, ShieldCheck } from 'lucide-react'
import { usePublicGallery } from '../../hooks/usePublicGallery'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import PawDecor from './PawDecor'
import Reveal from './Reveal'

const TRUST_BADGES = [
  { icon: Heart, label: 'Atendimento com carinho' },
  { icon: ShieldCheck, label: 'Ambiente seguro e limpo' },
  { icon: PawPrint, label: 'Profissionais experientes' },
]

/**
 * Banner grande no topo da landing. Por enquanto usa um fundo decorativo
 * (gradiente + patinhas) no lugar de uma foto real — trocar assim que
 * tivermos uma (ver Fase 6, galeria).
 */
export default function Hero() {
  const { data: shopInfo } = usePublicShopInfo()
  const { data: gallery } = usePublicGallery()
  const heroPhoto = gallery?.[0]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sage/25 via-gold/10 to-background">
      <PawDecor variant="hero" />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:py-28">
        <Reveal className="text-center lg:text-left">
          <p className="flex items-center justify-center gap-3 font-display text-3xl font-bold text-accent sm:text-5xl lg:justify-start">
            <PawPrint className="shrink-0 text-gold" size={28} />
            Bem-vindos!
            <PawPrint className="shrink-0 text-sage" size={28} />
          </p>
          <h1 className="mt-3 text-2xl font-semibold sm:text-3xl">Banho, tosa e muito carinho 🐶🐱</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted lg:mx-0">
            Cuidamos do seu pet como se fosse nosso. Confira nossos serviços e agende uma visita.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {shopInfo?.whatsapp ? (
              <a
                href={whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground shadow-soft hover:bg-[var(--accent-hover)]"
              >
                Agende hoje
              </a>
            ) : (
              <a
                href="#contato"
                className="rounded-full bg-accent px-6 py-3 font-medium text-accent-foreground shadow-soft hover:bg-[var(--accent-hover)]"
              >
                Agende hoje
              </a>
            )}
            <a
              href="#servicos"
              className="rounded-full border border-accent px-6 py-3 font-medium text-accent hover:bg-accent/10"
            >
              Ver serviços
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-sm text-muted">
                <Icon size={16} className="text-sage-foreground" /> {label}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Usa a primeira foto pública da galeria (ver /admin/gallery); sem
            nenhuma foto ainda, cai num cartão decorativo com as cores da marca. */}
        <Reveal
          delay={150}
          className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-sage/30 via-gold/20 to-surface-muted shadow-soft-lg"
        >
          {heroPhoto ? (
            <img
              src={heroPhoto.image_url}
              alt={heroPhoto.caption ?? 'Pet Encanto'}
              className="size-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <PawPrint size={72} className="text-accent/25" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
