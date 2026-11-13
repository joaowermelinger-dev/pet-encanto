import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { SCHEDULE_MESSAGE, whatsappLink } from '../../utils/whatsapp'
import ButtonLink from './ButtonLink'

/** Abertura da landing (inspirada numa referência do Pedro): sem bloco de fundo, forma verde atrás da foto (public/hero-banho.webp), selo do Taxi Dog e rabiscos só no computador. */
export default function Hero() {
  const { data: shopInfo } = usePublicShopInfo()

  const ctaHref = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, SCHEDULE_MESSAGE) : '#contato'
  const taxiHref = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar: Taxi Dog.') : '#contato'

  return (
    <section className="mx-auto max-w-[88rem] px-5 pt-4 lg:px-10">
      <div className="relative grid grid-cols-1 items-center gap-6 pt-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        {/* Rabiscos discretos no fundo (traço fino, sem brilho). */}
        <Doodles />

        <div className="relative lg:py-16">
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

        <div className="relative mx-auto w-full max-w-[24rem] sm:max-w-md lg:mr-0 lg:max-w-[38rem]">
          {/* Forma grande atrás do cachorro, saindo pela borda de baixo. */}
          <svg aria-hidden viewBox="0 0 400 360" className="absolute bottom-[2%] left-1/2 w-[104%] -translate-x-1/2 text-sage">
            <path fill="currentColor" d="M60 300 C10 260 20 170 80 130 C140 90 180 110 230 60 C280 15 360 30 385 100 C410 170 390 250 340 300 C290 350 120 350 60 300 Z" />
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

const Heart = ({ filled = false }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 22" className="size-full" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 20 C12 20 2 13.5 2 7.5 C2 4 4.6 2 7.3 2 C9.5 2 11 3.3 12 5 C13 3.3 14.5 2 16.7 2 C19.4 2 22 4 22 7.5 C22 13.5 12 20 12 20 Z" />
  </svg>
)

const Paw = ({ filled = false }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className="size-full" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
    <path d="M12 13 C8.5 13 6 16 6 18.5 C6 20.5 7.6 21.5 9.3 21 C10.4 20.7 11.2 20.3 12 20.3 C12.8 20.3 13.6 20.7 14.7 21 C16.4 21.5 18 20.5 18 18.5 C18 16 15.5 13 12 13 Z" />
    <ellipse cx="4.5" cy="10.5" rx="2.2" ry="2.8" />
    <ellipse cx="9" cy="5.5" rx="2.2" ry="3" />
    <ellipse cx="15" cy="5.5" rx="2.2" ry="3" />
    <ellipse cx="19.5" cy="10.5" rx="2.2" ry="2.8" />
  </svg>
)

const Squiggle = () => (
  <svg viewBox="0 0 60 16" className="size-full" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M2 8 q7 -10 14 0 t14 0 t14 0 t14 0" />
  </svg>
)

const Bubbles = () => (
  <svg viewBox="0 0 40 40" className="size-full" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="26" r="9" />
    <circle cx="28" cy="12" r="6" />
    <circle cx="31" cy="30" r="3.5" />
  </svg>
)

/** Rabiscos à mão no fundo da abertura (corações, patinhas, bolhas de banho, ondas). */
function Doodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className="absolute left-[3%] top-[3%] w-12 text-accent/30 lg:left-[2%] lg:top-[6%] lg:w-16"><Squiggle /></span>
      <span className="absolute right-[6%] top-[30%] size-7 -rotate-12 text-sage-deep/60 lg:left-[49%] lg:right-auto lg:top-[11%] lg:size-9"><Heart /></span>
      <span className="absolute right-[4%] top-[2%] size-5 rotate-12 text-gold lg:left-[56%] lg:right-auto lg:top-[30%] lg:size-6"><Heart filled /></span>
      <span className="absolute bottom-[38%] left-[5%] size-7 rotate-[18deg] text-sage/80 lg:bottom-[12%] lg:left-[46%] lg:size-9"><Paw filled /></span>
      <span className="absolute bottom-[45%] right-[5%] hidden size-8 -rotate-12 text-accent/30 sm:block lg:bottom-auto lg:left-[52%] lg:right-auto lg:top-[52%]"><Paw /></span>
      <span className="absolute bottom-[30%] right-[3%] size-9 text-sage-deep/40 lg:bottom-auto lg:left-[42%] lg:right-auto lg:top-[4%] lg:size-10"><Bubbles /></span>
      <span className="absolute bottom-[6%] left-[38%] hidden w-14 text-gold/80 lg:block"><Squiggle /></span>
    </div>
  )
}
