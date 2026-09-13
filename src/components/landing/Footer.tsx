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
  { href: '#galeria', label: 'Galeria' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#contato', label: 'Localização' },
]

export default function Footer() {
  const { data } = usePublicShopInfo()
  const hasSocial = data?.instagram_url || data?.whatsapp

  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Pet Encanto" className="size-8 rounded-full object-cover" />
              <span className="font-display text-lg font-semibold">Pet Encanto</span>
            </div>
            <p className="mt-3 text-sm text-accent-foreground/70">
              Banho, tosa e muito carinho para o seu melhor amigo.
            </p>
            {hasSocial && (
              <div className="mt-4 flex items-center gap-2">
                {data?.instagram_url && (
                  <a
                    href={data.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 text-accent-foreground hover:bg-white/20"
                  >
                    <InstagramIcon size={16} />
                  </a>
                )}
                {data?.whatsapp && (
                  <a
                    href={whatsappLink(data.whatsapp, 'Olá! Gostaria de agendar um horário para meu pet.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 text-accent-foreground hover:bg-white/20"
                  >
                    <MessageCircle size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground/60">Navegação</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
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
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-foreground/60">Atendimento</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-accent-foreground/80">
              <li>{data?.address ?? '—'}</li>
              <li>{data?.phone ?? '—'}</li>
              <li>{data?.opening_hours ?? '—'}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-accent-foreground/60">
        © {new Date().getFullYear()} Pet Encanto. Feito com carinho.
      </div>
    </footer>
  )
}
