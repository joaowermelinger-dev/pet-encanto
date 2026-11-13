import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { SCHEDULE_MESSAGE, whatsappLink } from '../../utils/whatsapp'
import ButtonLink from './ButtonLink'

/** Abertura da landing: título, um botão de agendar e a foto (public/hero-cachorro.webp, 4:5). */
export default function Hero() {
  const { data: shopInfo } = usePublicShopInfo()

  const ctaHref = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, SCHEDULE_MESSAGE) : '#contato'

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-24">
      <div>
        <h1 className="text-balance font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Banho, tosa e muito carinho.
        </h1>
        <p className="mt-5 max-w-lg text-pretty text-lg text-muted sm:text-xl">
          Atendemos só cachorros. Escolha o serviço e chame a gente no WhatsApp: o horário e o valor são combinados por lá.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink href={ctaHref} external={Boolean(shopInfo?.whatsapp)}>
            Agendar pelo WhatsApp
          </ButtonLink>
          <a href="#servicos" className="text-center font-bold text-accent underline decoration-gold decoration-2 underline-offset-4 hover:decoration-accent">
            Ver serviços
          </a>
        </div>

        {(shopInfo?.address || shopInfo?.opening_hours) && (
          <dl className="mt-10 grid gap-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
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

      <div className="mx-auto w-full max-w-[20rem] sm:max-w-md">
        <img
          src="/hero-cachorro.webp"
          alt="Cachorrinho enrolado na toalha depois do banho"
          width={1122}
          height={1402}
          className="aspect-[4/5] w-full rounded-lg object-cover"
        />
      </div>
    </section>
  )
}
