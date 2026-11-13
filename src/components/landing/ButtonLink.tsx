import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'light'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:bg-[var(--accent-hover)]',
  outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground',
  light: 'bg-background text-foreground hover:bg-surface-muted',
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
  /** Abre em outra aba (links do WhatsApp e do mapa). */
  external?: boolean
  children: ReactNode
}

/** Botão da página inicial (é um link). Um só estilo, pra não repetir classes em cada seção. */
export default function ButtonLink({ variant = 'primary', external, className = '', children, ...props }: ButtonLinkProps) {
  return (
    <a
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-base font-bold ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </a>
  )
}
