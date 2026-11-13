import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { SCHEDULE_MESSAGE, whatsappLink } from '../../utils/whatsapp'
import ButtonLink from './ButtonLink'
import { NAV_LINKS } from './navLinks'


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: shopInfo } = usePublicShopInfo()

  // Ganha uma linha embaixo só depois de rolar um pouco.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scheduleHref = shopInfo?.whatsapp ? whatsappLink(shopInfo.whatsapp, SCHEDULE_MESSAGE) : undefined

  return (
    <header
      className={`sticky top-0 z-20 border-b bg-background ${scrolled || menuOpen ? 'border-border' : 'border-transparent'}`}
    >
      <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-5 lg:px-10 py-3">
        <a href="#" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Pet Encanto" className="size-11 rounded-full object-cover" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Pet <span className="font-script text-accent">Encanto</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-[15px] font-semibold lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-foreground/80 hover:text-foreground hover:underline underline-offset-4">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 sm:flex">
          <Link to="/login" className="text-xs font-semibold text-muted hover:text-foreground">
            Sou o dono
          </Link>
          {scheduleHref && (
            <ButtonLink href={scheduleHref} external className="!px-5 !py-2.5 text-sm">
              Agendar
            </ButtonLink>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          className="flex size-11 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mx-auto flex max-w-[88rem] flex-col gap-1 px-5 lg:px-10 pb-5 pt-1 lg:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-3 text-base font-semibold hover:bg-surface-muted"
            >
              {link.label}
            </a>
          ))}
          {scheduleHref && (
            <ButtonLink href={scheduleHref} external className="mt-2">
              Agendar pelo WhatsApp
            </ButtonLink>
          )}
          <Link to="/login" className="mt-1 px-3 py-2 text-center text-xs font-semibold text-muted hover:text-foreground">
            Sou o dono
          </Link>
        </nav>
      )}
    </header>
  )
}
