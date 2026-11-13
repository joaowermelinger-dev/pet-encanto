import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { SCHEDULE_MESSAGE, whatsappLink } from '../../utils/whatsapp'
import ButtonLink from './ButtonLink'

/** Abertura da landing: título, um botão de agendar e a foto (public/hero-cachorro.webp, 4:5). */
export default function Hero() {
  const { data: shopInfo } = usePublicShopInfo()

  const ctaHref = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, SCHEDULE_MESSAGE) : '#contato'

  return (
    // Em telas grandes o topo ocupa a altura da tela: texto alinhado com o
    // resto da página (max-w-6xl) e a foto preenchendo a metade direita até a borda.
    <section className="grid grid-cols-1 lg:min-h-[min(calc(100svh-4.25rem),56rem)] lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 pb-12 pt-8 sm:pt-12 lg:py-16 lg:pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] lg:pr-16">
        <h1 className="landing-enter text-balance font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Banho, tosa e muito carinho.
        </h1>
        <p className="landing-enter [animation-delay:120ms] mt-5 max-w-lg text-pretty text-lg text-muted sm:text-xl">
          Atendemos só cachorros. Escolha o serviço e chame a gente no WhatsApp: o horário e o valor são combinados por lá.
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

      <div className="relative mx-5 aspect-[4/5] overflow-hidden rounded-lg sm:mx-auto sm:w-full sm:max-w-md lg:mx-0 lg:aspect-auto lg:max-w-none lg:rounded-none">
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
