import { Heart, MessageCircle, PawPrint, ShieldCheck, Sparkles } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import Reveal from './Reveal'

const TRUST_BADGES = [
  { icon: Heart, label: 'Atendimento com carinho' },
  { icon: ShieldCheck, label: 'Ambiente seguro e limpo' },
  { icon: PawPrint, label: 'Profissionais experientes' },
]

/**
 * Banner grande no topo da landing. A foto (public/hero-cachorro.webp,
 * proporção 4:5) aparece num recorte em arco.
 */
export default function Hero() {
  const { data: shopInfo } = usePublicShopInfo()

  const ctaHref = shopInfo?.whatsapp
    ? whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')
    : '#contato'
  const ctaExternal = Boolean(shopInfo?.whatsapp)

  return (
    <section className="relative">
      {/* Manchas de cor suaves no fundo. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-8 size-[28rem] rounded-full bg-sage/20 blur-3xl" />
        <div className="absolute -right-24 top-48 size-[24rem] rounded-full bg-gold/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-8 sm:pb-24 sm:pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-28 lg:pt-16">
        <Reveal className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 font-script text-lg text-accent shadow-soft">
            <PawPrint className="shrink-0 text-gold" size={18} />
            Bem-vindos!
            <PawPrint className="shrink-0 text-sage" size={18} />
          </p>
          <h1 className="mt-6 text-balance font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]">
            Banho, tosa e <span className="font-script text-accent">muito carinho</span> 🐶
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted sm:text-xl lg:mx-0">
            Cuidamos do seu pet como se fosse nosso. Confira nossos serviços e agende uma visita.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <a
              href={ctaHref}
              target={ctaExternal ? '_blank' : undefined}
              rel={ctaExternal ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-bold text-accent-foreground shadow-soft-lg hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
            >
              <MessageCircle size={18} /> Agende hoje
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center justify-center rounded-full border-2 border-accent/25 bg-surface/60 px-7 py-[14px] text-base font-bold text-accent hover:border-accent hover:bg-surface"
            >
              Ver serviços
            </a>
          </div>

          <ul className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 lg:justify-start">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-semibold text-foreground/75">
                <span className="flex size-8 items-center justify-center rounded-full bg-sage/20 text-sage-fg">
                  <Icon size={15} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto w-full max-w-[19rem] sm:max-w-md">
          {/* Moldura dourada deslocada atrás da foto. */}
          <div aria-hidden className="absolute inset-0 translate-x-4 translate-y-4 rounded-t-full rounded-b-[2.5rem] border-2 border-gold/60" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2.5rem] bg-gradient-to-br from-sage/40 via-gold/25 to-surface-muted shadow-soft-lg">
            <img
              src="/hero-cachorro.webp"
              alt="Cachorrinho feliz, enrolado na toalha depois do banho"
              width={1122}
              height={1402}
              className="size-full object-cover"
            />
          </div>
          <img
            src="/logo.png"
            alt=""
            aria-hidden
            className="absolute -bottom-6 -left-4 size-24 rounded-full object-cover shadow-soft-lg ring-[6px] ring-background sm:-left-8 sm:size-28"
          />
          <Sparkles aria-hidden className="absolute -right-3 top-10 text-gold" size={30} />
          <Sparkles aria-hidden className="absolute -left-6 top-1/3 text-sage" size={20} />
        </Reveal>
      </div>
    </section>
  )
}
