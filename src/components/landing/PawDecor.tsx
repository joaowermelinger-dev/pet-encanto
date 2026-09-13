import { PawPrint, Sparkles } from 'lucide-react'

interface PawDecorProps {
  /** "hero" tem mais elementos e maiores; "subtle" é usado nas seções internas. */
  variant?: 'hero' | 'subtle'
}

/**
 * Patinhas/sparkles decorativos espalhados atrás do conteúdo de uma seção.
 * O container pai precisa de `relative overflow-hidden`, e o conteúdo em
 * primeiro plano precisa da classe `relative` pra ficar acima (ver uso nas
 * seções da landing).
 */
export default function PawDecor({ variant = 'subtle' }: PawDecorProps) {
  if (variant === 'hero') {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <PawPrint className="absolute left-[8%] top-[18%] rotate-[-15deg] text-sage/40" size={40} />
        <PawPrint className="absolute right-[10%] top-[28%] rotate-[20deg] text-gold/50" size={32} />
        <PawPrint className="absolute left-[18%] bottom-[15%] rotate-[10deg] text-gold/40" size={28} />
        <PawPrint className="absolute right-[20%] bottom-[22%] rotate-[-25deg] text-sage/40" size={36} />
        <Sparkles className="absolute left-[30%] top-[12%] text-gold/60" size={20} />
        <Sparkles className="absolute right-[32%] bottom-[18%] text-sage/50" size={18} />
      </div>
    )
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <PawPrint className="absolute left-[3%] top-[8%] rotate-[-12deg] text-sage/15" size={26} />
      <PawPrint className="absolute right-[5%] top-[60%] rotate-[16deg] text-gold/20" size={22} />
      <PawPrint className="absolute left-[10%] bottom-[6%] rotate-[8deg] text-gold/15" size={20} />
      <Sparkles className="absolute right-[14%] top-[14%] text-sage/20" size={16} />
    </div>
  )
}
