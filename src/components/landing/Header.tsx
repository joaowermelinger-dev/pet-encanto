import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'

const LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#contato', label: 'Localização' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: shopInfo } = usePublicShopInfo()

  return (
    <header className="sticky top-3 z-10 px-3 sm:top-4 sm:px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between rounded-full bg-sage-deep px-5 py-3 shadow-soft sm:px-6">
          <span className="flex items-center gap-2">
            <img src="/logo.png" alt="Pet Encanto" className="size-9 rounded-full object-cover ring-2 ring-white/40" />
            <span className="font-display text-lg font-semibold text-white">Pet Encanto</span>
          </span>

          <nav className="hidden items-center gap-6 text-sm font-medium text-white/90 lg:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            {shopInfo?.whatsapp && (
              <a
                href={whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
              >
                Agende pelo WhatsApp
              </a>
            )}
            <Link to="/login" className="text-xs font-medium text-white/70 hover:text-white">
              Sou o dono
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
            className="rounded-full p-2 text-white lg:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="mt-2 flex flex-col gap-1 rounded-2xl bg-sage-deep p-3 text-sm shadow-soft lg:hidden">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 font-medium text-white/90 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            {shopInfo?.whatsapp && (
              <a
                href={whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 rounded-full bg-accent px-4 py-2 text-center font-medium text-accent-foreground hover:bg-[var(--accent-hover)]"
              >
                Agende pelo WhatsApp
              </a>
            )}
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-center text-xs font-medium text-white/70 hover:text-white"
            >
              Sou o dono
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
