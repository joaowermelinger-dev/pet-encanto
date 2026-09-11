import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/clients', label: 'Clientes' },
  { to: '/admin/appointments', label: 'Agenda' },
  { to: '/admin/services', label: 'Serviços' },
  { to: '/admin/products', label: 'Produtos' },
  { to: '/admin/sales', label: 'Vendas' },
  { to: '/admin/gallery', label: 'Galeria' },
  { to: '/admin/settings', label: 'Configurações' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-56 shrink-0 border-r border-border bg-surface p-4">
        <div className="mb-6 text-lg font-semibold text-accent">🐾 Pet Encanto</div>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
          <span className="text-sm text-muted">Olá, {user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-muted hover:text-foreground">
            Sair
          </button>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
