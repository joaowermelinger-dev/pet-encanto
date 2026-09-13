import { usePublicShopInfo } from '../../hooks/usePublicShopInfo'

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#diferenciais', label: 'Diferenciais' },
  { href: '#contato', label: 'Localização' },
]

export default function Footer() {
  const { data } = usePublicShopInfo()

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
