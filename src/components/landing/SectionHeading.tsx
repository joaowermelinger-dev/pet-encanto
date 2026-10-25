import type { ReactNode } from 'react'
import { PawPrint } from 'lucide-react'
import Reveal from './Reveal'

interface SectionHeadingProps {
  /** Rótulo curtinho acima do título (o mesmo nome do link no menu). */
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  /** "dark" para seções com fundo escuro (texto claro). */
  tone?: 'light' | 'dark'
}

/** Cabeçalho padrão das seções da landing: rótulo com patinha, título e subtítulo. */
export default function SectionHeading({ eyebrow, title, subtitle, tone = 'light' }: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
          dark ? 'bg-white/10 text-gold' : 'bg-sage/15 text-sage-fg'
        }`}
      >
        <PawPrint size={13} /> {eyebrow}
      </span>
      <h2
        className={`mt-4 text-balance font-display text-3xl font-semibold leading-tight sm:text-[2.6rem] ${
          dark ? 'text-white' : ''
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg ${dark ? 'text-white/75' : 'text-muted'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
