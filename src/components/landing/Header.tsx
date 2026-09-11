import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-lg font-semibold text-accent">🐾 Pet Encanto</span>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <a href="#servicos" className="hover:text-foreground">
            Serviços
          </a>
          <a href="#mostruario" className="hover:text-foreground">
            Loja
          </a>
          <a href="#galeria" className="hover:text-foreground">
            Galeria
          </a>
          <a href="#contato" className="hover:text-foreground">
            Contato
          </a>
          <Link
            to="/login"
            className="rounded-full bg-accent px-4 py-2 font-medium text-accent-foreground hover:opacity-90"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}
