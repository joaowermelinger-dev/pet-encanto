import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#mostruario', label: 'Loja' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#contato', label: 'Contato' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="flex items-center gap-2">
          <img src="/logo.png" alt="Pet Encanto" className="size-9 rounded-full object-cover" />
          <span className="font-display text-lg font-semibold text-accent">Pet Encanto</span>
        </span>

        <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="rounded-full bg-accent px-4 py-2 font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
          >
            Entrar
          </Link>
        </nav>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
          className="rounded-lg p-2 text-foreground sm:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 text-sm sm:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-2 text-muted hover:bg-surface-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/login"
            className="mt-1 rounded-full bg-accent px-4 py-2 text-center font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
          >
            Entrar
          </Link>
        </nav>
      )}
    </header>
  )
}
