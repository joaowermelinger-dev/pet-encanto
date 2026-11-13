import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { SCHEDULE_MESSAGE, whatsappLink } from '../../utils/whatsapp'
import ButtonLink from './ButtonLink'

/** Abertura da landing: título, um botão de agendar e a foto (public/hero-cachorro.webp, 4:5). */
export default function Hero() {
  const { data: shopInfo } = usePublicShopInfo()

  const ctaHref = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, SCHEDULE_MESSAGE) : '#contato'

  return (
    <section className="mx-auto grid max-w-[88rem] grid-cols-1 items-center gap-10 px-5 lg:px-10 pb-6 pt-8 sm:pt-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
      <div>
        <h1 className="landing-enter text-balance font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
          Banho, tosa e muito carinho.
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
          <dl className="landing-enter [animation-delay:360ms] mt-10 hidden gap-3 border-t border-border pt-6 text-sm sm:grid sm:grid-cols-2">
            {shopInfo?.address && (
              <div>
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

      <div className="relative mx-auto aspect-[4/5] w-full max-w-[20rem] overflow-hidden rounded-lg sm:max-w-sm lg:mr-0 lg:max-w-[28rem]">
        <img
          src="/hero-cachorro.webp"
          alt="Cachorrinho enrolado na toalha depois do banho"
          width={1122}
          height={1402}
          className="landing-photo absolute inset-0 size-full object-cover object-[50%_30%]"
        />
      </div>
    </section>
  )
}
