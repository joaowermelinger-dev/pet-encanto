import { useEffect, useState } from 'react'
import { Menu, MessageCircle, X } from 'lucide-react'
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
  const [scrolled, setScrolled] = useState(false)
  const { data: shopInfo } = usePublicShopInfo()

  // Ganha fundo/sombra só depois de rolar um pouco, pra não pesar no topo.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || menuOpen

  return (
    <header
      className={`sticky top-0 z-20 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solid ? 'bg-background/90 shadow-soft backdrop-blur-md' : 'bg-background/0'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:py-4">
        <a href="#" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Pet Encanto" className="size-11 rounded-full object-cover shadow-soft sm:size-12" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Pet <span className="italic text-accent">Encanto</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-[15px] font-semibold text-foreground/80 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-gold after:transition-transform hover:text-foreground hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          <Link to="/login" className="text-xs font-semibold text-muted hover:text-foreground">
            Sou o dono
          </Link>
          {shopInfo?.whatsapp && (
            <a
              href={whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-soft hover:bg-[var(--accent-hover)]"
            >
              <MessageCircle size={16} /> Agende pelo WhatsApp
            </a>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground lg:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 border-t border-border px-5 pb-5 pt-3 lg:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-semibold hover:bg-surface-muted"
            >
              {link.label}
            </a>
          ))}
          {shopInfo?.whatsapp && (
            <a
              href={whatsappLink(shopInfo.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3.5 font-bold text-accent-foreground hover:bg-[var(--accent-hover)]"
            >
              <MessageCircle size={18} /> Agende pelo WhatsApp
            </a>
          )}
          <Link to="/login" className="mt-1 rounded-xl px-3 py-2 text-center text-xs font-semibold text-muted hover:text-foreground">
            Sou o dono
          </Link>
        </nav>
      )}
    </header>
  )
}
