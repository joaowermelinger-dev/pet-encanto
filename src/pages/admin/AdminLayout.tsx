import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/clients', label: 'Clientes' },
  { to: '/admin/appointments', label: 'Atendimentos' },
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
    <div className="flex min-h-screen bg-background">
      {/* Fundo escurecido atrás do menu, só no mobile. */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-border bg-surface p-4 transition-transform md:static md:z-auto md:w-56 md:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold text-accent">🐾 Pet Encanto</span>
          <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu" className="rounded-lg p-1 text-muted md:hidden">
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
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted hover:bg-surface-muted'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-surface-muted md:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="truncate text-sm text-muted">Olá, {user?.name}</span>
          </div>
          <button onClick={handleLogout} className="shrink-0 text-sm text-muted hover:text-foreground">
            Sair
          </button>
        </header>
        <main className="min-w-0 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
