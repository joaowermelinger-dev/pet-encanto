import { useState } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/clients', label: 'Clientes' },
  { to: '/admin/appointments', label: 'Atendimentos' },
  { to: '/admin/clubinho', label: 'Clubinho' },
  { to: '/admin/products', label: 'Produtos' },
  { to: '/admin/sales', label: 'Vendas' },
  { to: '/admin/gallery', label: 'Galeria' },
  { to: '/admin/updates', label: 'Atualizações' },
  { to: '/admin/settings', label: 'Configurações' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen items-stretch gap-3 bg-surface-muted p-3">
      {/* Fundo escurecido atrás do menu, só no mobile. */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <aside
        className={`fixed left-3 top-3 bottom-3 z-40 w-64 shrink-0 rounded-2xl bg-surface p-4 transition-transform md:static md:z-auto md:w-56 md:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Pet Encanto" className="size-9 shrink-0 rounded-full object-cover" />
            <span className="font-display text-lg font-semibold leading-tight text-accent">Pet Encanto</span>
          </div>
          <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu" className="rounded-lg p-1 text-muted hover:bg-surface-muted md:hidden">
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted hover:bg-surface-muted hover:text-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <header className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface-muted md:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold/25 text-xs font-semibold text-gold-foreground">
              {user?.name?.[0]?.toUpperCase()}
            </span>
            <span className="truncate text-sm text-muted">
              Olá, <span className="font-medium text-foreground">{user?.name}</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-surface-muted hover:text-foreground"
          >
            <LogOut size={15} /> Sair
          </button>
        </header>
        <main className="min-w-0 flex-1 rounded-2xl bg-surface p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
