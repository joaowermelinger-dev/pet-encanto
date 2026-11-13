import type { ReactNode } from 'react'

interface SectionHeadingProps {
  title: ReactNode
  subtitle?: ReactNode
  /** "dark" para seções com fundo escuro (texto claro). */
  tone?: 'light' | 'dark'
}

/** Título de cada seção da landing (alinhado à esquerda, sem etiqueta em cima). */
export default function SectionHeading({ title, subtitle, tone = 'light' }: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <div className="max-w-2xl">
      <h2 className={`text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl ${dark ? 'text-white' : ''}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-pretty text-base sm:text-lg ${dark ? 'text-white/75' : 'text-muted'}`}>{subtitle}</p>
      )}
    </div>
  )
}
