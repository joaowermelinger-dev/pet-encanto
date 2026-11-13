import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import ButtonLink from './ButtonLink'

/** Faixa logo abaixo da abertura destacando o Taxi Dog (escolha do Pedro, 13/11/2026). */
export default function TaxiDogBanner() {
  const { data: shopInfo } = usePublicShopInfo()
  const href = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar: Taxi Dog.') : '#contato'

  return (
    <section className="mx-auto max-w-[88rem] px-5 pt-6 lg:px-10">
      <div className="landing-enter [animation-delay:480ms] flex flex-col gap-5 rounded-lg bg-sage-deep px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Taxi Dog</h2>
          <p className="mt-1 text-white/80 sm:text-lg">Buscamos e levamos seu pet. É só combinar pelo WhatsApp.</p>
        </div>
        <ButtonLink
          href={href}
          external={Boolean(shopInfo?.whatsapp)}
          className="shrink-0 bg-gold text-gold-foreground hover:bg-[#d6b07c]"
        >
          Agendar Taxi Dog
        </ButtonLink>
      </div>
    </section>
  )
}
