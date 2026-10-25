import { PawPrint } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="bg-sage-deep px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 sm:text-xs">
      <span className="inline-flex items-center gap-2">
        <PawPrint size={13} className="text-gold" /> Atendimento gentil & bem-estar animal
      </span>
    </div>
  )
}
