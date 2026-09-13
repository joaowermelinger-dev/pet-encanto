import { PawPrint } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="bg-accent px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-accent-foreground">
      <span className="inline-flex items-center gap-1.5">
        <PawPrint size={13} /> Atendimento gentil & bem-estar animal
      </span>
    </div>
  )
}
