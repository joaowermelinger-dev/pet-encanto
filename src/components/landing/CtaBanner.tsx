import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { SCHEDULE_MESSAGE, whatsappLink } from '../../utils/whatsapp'
import ButtonLink from './ButtonLink'

export default function CtaBanner() {
  const { data: shopInfo } = usePublicShopInfo()
  if (!shopInfo?.whatsapp) return null

  return (
    <section className="mx-auto max-w-[88rem] px-5 lg:px-10 pt-16 sm:pt-24">
      <div className="flex flex-col gap-6 rounded-lg bg-accent px-6 py-10 text-accent-foreground sm:px-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">Quer marcar um horário?</h2>
          <p className="mt-2 max-w-md text-pretty text-accent-foreground/80">
            Chame no WhatsApp, diga o serviço e o nome do seu pet.
          </p>
        </div>
        <ButtonLink
          href={whatsappLink(shopInfo.whatsapp, SCHEDULE_MESSAGE)}
          external
          className="shrink-0 bg-gold text-gold-foreground hover:bg-[#d6b07c]"
        >
          Falar no WhatsApp
        </ButtonLink>
      </div>
    </section>
  )
}
