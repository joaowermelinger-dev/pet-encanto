import { MessageCircle, PawPrint } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import Reveal from './Reveal'

export default function CtaBanner() {
  const { data: shopInfo } = usePublicShopInfo()
  if (!shopInfo?.whatsapp) return null

  return (
    <section className="px-5 pt-20 sm:pt-28">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-accent px-6 py-16 text-center text-accent-foreground shadow-soft-lg sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 size-64 rounded-full border-[28px] border-gold/15" />
          <div className="absolute -bottom-20 -right-10 size-72 rounded-full bg-gold/10" />
          <PawPrint className="absolute right-[12%] top-8 rotate-12 text-gold/30" size={40} />
          <PawPrint className="absolute bottom-8 left-[10%] -rotate-12 text-gold/25" size={30} />
        </div>
        <div className="relative">
          <h2 className="text-balance font-display text-3xl font-semibold sm:text-5xl">
            Seu pet merece esse <span className="italic text-gold">carinho</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-pretty text-accent-foreground/80 sm:text-lg">
            Agende um horário e deixe seu pet ainda mais feliz. Fale com a gente pelo WhatsApp e marque uma visita.
          </p>
          <a
            href={whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-4 text-[15px] sm:px-7 sm:text-base font-bold text-gold-foreground shadow-soft-lg hover:-translate-y-0.5 hover:bg-[#d6b07c] sm:w-auto"
          >
            <MessageCircle size={19} /> Agende agora pelo WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  )
}
