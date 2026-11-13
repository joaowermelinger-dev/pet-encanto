import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { SCHEDULE_MESSAGE, whatsappLink } from '../../utils/whatsapp'
import ButtonLink from './ButtonLink'

/** Abertura da landing (inspirada numa referência do Pedro): bloco bege, forma verde atrás da foto (public/hero-banho.webp), selo do Taxi Dog e rabiscos só no computador. */
export default function Hero() {
  const { data: shopInfo } = usePublicShopInfo()

  const ctaHref = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, SCHEDULE_MESSAGE) : '#contato'
  const taxiHref = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar: Taxi Dog.') : '#contato'

  return (
    <section className="mx-auto max-w-[88rem] px-5 pt-4 lg:px-10">
      <div className="relative grid grid-cols-1 items-center gap-6 overflow-hidden rounded-lg bg-surface-muted px-6 pt-10 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:px-14 lg:pt-0">
        {/* Rabiscos discretos no fundo (traço fino, sem brilho). */}
        <Doodles />

        <div className="relative lg:py-20">
          <p className="landing-enter text-sm font-bold uppercase tracking-[0.14em] text-sage-deep">Banho e tosa</p>
          <h1 className="landing-enter mt-3 text-balance font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            Banho, tosa e <span className="text-sage-deep">muito carinho.</span>
          </h1>
          <p className="landing-enter [animation-delay:120ms] mt-5 max-w-lg text-pretty text-lg text-muted sm:text-xl">
            Escolha o serviço e agende pelo WhatsApp.
          </p>

          <div className="landing-enter [animation-delay:240ms] mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href={ctaHref} external={Boolean(shopInfo?.whatsapp)}>
              Agendar pelo WhatsApp
            </ButtonLink>
            <a href="#servicos" className="text-center font-bold text-accent underline decoration-gold decoration-2 underline-offset-4 hover:decoration-accent">
              Ver serviços
            </a>
          </div>

          {(shopInfo?.address || shopInfo?.opening_hours) && (
            <dl className="landing-enter [animation-delay:360ms] mt-10 hidden gap-6 text-sm sm:flex">
              {shopInfo?.address && (
                <div className="max-w-xs">
                  <dt className="font-bold">Endereço</dt>
                  <dd className="mt-0.5 text-muted">{shopInfo.address}</dd>
                </div>
              )}
              {shopInfo?.opening_hours && (
                <div>
                  <dt className="font-bold">Horário</dt>
                  <dd className="mt-0.5 text-muted">{shopInfo.opening_hours}</dd>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-[24rem] self-end sm:max-w-md lg:mr-0 lg:max-w-[38rem]">
          {/* Forma grande atrás do cachorro, saindo pela borda de baixo. */}
          <svg aria-hidden viewBox="0 0 400 300" className="absolute -bottom-6 left-1/2 w-[112%] -translate-x-1/2 text-sage">
            <path fill="currentColor" d="M20 300 C10 210 60 120 150 95 C230 72 270 20 330 40 C390 60 400 150 390 300 Z" />
          </svg>
          <img
            src="/hero-banho.webp"
            alt="Golden retriever com espuma de banho, toalha e escova"
            width={1100}
            height={1001}
            className="landing-photo relative w-full"
          />
          {/* Selo redondo com o Taxi Dog (serviço real). */}
          <a
            href={taxiHref}
            {...(shopInfo?.whatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label="Taxi Dog: buscamos e levamos. Agendar pelo WhatsApp"
            className="absolute right-0 top-4 flex size-24 -rotate-6 flex-col items-center justify-center rounded-full border-2 border-dashed border-accent/40 bg-background text-center leading-tight text-accent sm:size-28 lg:-right-2 lg:top-10"
          >
            <span className="font-display text-lg font-semibold sm:text-xl">Taxi Dog</span>
            <span className="text-[11px] font-bold sm:text-xs">buscamos e<br />levamos</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Doodles() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 hidden size-full text-accent/25 lg:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* coração */}
      <svg x="52%" y="12%" overflow="visible"><path d="M0 6 C0 0 8 -2 10 4 C12 -2 20 0 20 6 C20 13 10 18 10 18 C10 18 0 13 0 6 Z" /></svg>
      {/* patinha */}
      <svg x="46%" y="80%" overflow="visible">
        <ellipse cx="10" cy="14" rx="6" ry="5" />
        <circle cx="3" cy="6" r="2.5" />
        <circle cx="8" cy="2" r="2.5" />
        <circle cx="14" cy="2" r="2.5" />
        <circle cx="19" cy="6" r="2.5" />
      </svg>
      {/* rabisco ondulado */}
      <svg x="4%" y="8%" overflow="visible"><path d="M0 0 q6 -8 12 0 t12 0 t12 0" /></svg>
    </svg>
  )
}
