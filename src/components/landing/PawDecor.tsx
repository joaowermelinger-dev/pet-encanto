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
 *
 * O bloco "xl:block" extra só aparece em telas bem largas — é pra preencher
 * as laterais vazias que sobram quando o conteúdo (max-w-5xl) fica bem menor
 * que a tela, sem bagunçar tablet/mobile onde não existe esse vazio.
 */
export default function PawDecor({ variant = 'subtle' }: PawDecorProps) {
  if (variant === 'hero') {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
        <PawPrint className="absolute left-[3%] top-[6%] rotate-[-15deg] text-sage/40" size={40} />
        <PawPrint className="absolute right-[3%] top-[8%] rotate-[20deg] text-gold/50" size={32} />
        <PawPrint className="absolute left-[4%] bottom-[6%] rotate-[10deg] text-gold/40" size={28} />
        <PawPrint className="absolute right-[4%] bottom-[8%] rotate-[-25deg] text-sage/40" size={36} />
        <Sparkles className="absolute left-[14%] top-[4%] text-gold/60" size={20} />
        <Sparkles className="absolute right-[14%] bottom-[6%] text-sage/50" size={18} />

        {/* Preenche as laterais em telas bem largas. */}
        <div className="hidden xl:block">
          <PawPrint className="absolute left-[0.5%] top-[35%] rotate-[8deg] text-sage/30" size={30} />
          <PawPrint className="absolute right-[0.5%] top-[38%] rotate-[-10deg] text-gold/35" size={26} />
          <Sparkles className="absolute left-[1.5%] top-[55%] text-gold/40" size={16} />
          <Sparkles className="absolute right-[1.5%] top-[58%] text-sage/40" size={16} />
        </div>
      </div>
    )
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <PawPrint className="absolute left-[3%] top-[8%] rotate-[-12deg] text-sage/15" size={26} />
      <PawPrint className="absolute right-[5%] top-[60%] rotate-[16deg] text-gold/20" size={22} />
      <PawPrint className="absolute left-[10%] bottom-[6%] rotate-[8deg] text-gold/15" size={20} />
      <Sparkles className="absolute right-[14%] top-[14%] text-sage/20" size={16} />

      {/* Preenche as laterais em telas bem largas. */}
      <div className="hidden xl:block">
        <PawPrint className="absolute left-[1%] top-[20%] rotate-[-6deg] text-gold/20" size={24} />
        <PawPrint className="absolute left-[2%] top-[75%] rotate-[14deg] text-sage/20" size={20} />
        <PawPrint className="absolute right-[1%] top-[30%] rotate-[10deg] text-sage/20" size={26} />
        <PawPrint className="absolute right-[2%] top-[80%] rotate-[-14deg] text-gold/20" size={22} />
        <Sparkles className="absolute left-[3%] top-[45%] text-sage/25" size={14} />
        <Sparkles className="absolute right-[3.5%] top-[55%] text-gold/25" size={14} />
      </div>
    </div>
  )
}
