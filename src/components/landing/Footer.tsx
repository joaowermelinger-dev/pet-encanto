import { MessageCircle } from 'lucide-react'
import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'
import { whatsappLink } from '../../utils/whatsapp'

// lucide-react não tem mais ícones de marca (Instagram, etc.) — desenhado à
// mão no mesmo estilo (stroke, viewBox 24x24) pra combinar com os outros.
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#contato', label: 'Localização' },
]

export default function Footer() {
  const { data } = usePublicShopInfo()
  const hasSocial = data?.instagram_url || data?.whatsapp

  return (
    <footer className="mt-4 bg-[#2f2114] text-accent-foreground">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Pet Encanto" className="size-14 rounded-full object-cover" />
              <span className="font-display text-2xl font-semibold">
                Pet <span className="font-script text-gold">Encanto</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-accent-foreground/70">
              Banho, tosa e muito carinho para o seu melhor amigo.
            </p>
            {hasSocial && (
              <div className="mt-5 flex items-center gap-2">
                {data?.instagram_url && (
                  <a
                    href={data.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex size-11 items-center justify-center rounded-full bg-white/10 text-accent-foreground hover:bg-gold hover:text-gold-foreground"
                  >
                    <InstagramIcon size={18} />
                  </a>
                )}
                {data?.whatsapp && (
                  <a
                    href={whatsappLink(data.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex size-11 items-center justify-center rounded-full bg-white/10 text-accent-foreground hover:bg-gold hover:text-gold-foreground"
                  >
                    <MessageCircle size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Navegação</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-accent-foreground/80 hover:text-accent-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Atendimento</p>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-accent-foreground/80">
              <li>{data?.address ?? '—'}</li>
              <li>{data?.phone ?? '—'}</li>
              <li>{data?.opening_hours ?? '—'}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-accent-foreground/60">
        © {new Date().getFullYear()} Pet Encanto. Feito com carinho.
      </div>
    </footer>
  )
}
