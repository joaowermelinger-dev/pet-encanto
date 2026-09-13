import { MessageCircle } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'
import Reveal from './Reveal'

export default function CtaBanner() {
  const { data: shopInfo } = usePublicShopInfo()
  if (!shopInfo?.whatsapp) return null

  return (
    <Reveal
      as="section"
      className="mx-4 my-4 rounded-3xl bg-accent px-6 py-14 text-center text-accent-foreground shadow-soft-lg sm:mx-auto sm:max-w-5xl sm:px-12"
    >
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Seu pet merece esse carinho</h2>
      <p className="mx-auto mt-3 max-w-md text-accent-foreground/80">
        Agende um horário e deixe seu pet ainda mais feliz. Fale com a gente pelo WhatsApp e marque uma visita.
      </p>
      <a
        href={whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 font-medium text-accent hover:bg-surface-muted"
      >
        <MessageCircle size={18} /> Agende agora pelo WhatsApp
      </a>
    </Reveal>
  )
}
