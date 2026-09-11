import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

function FullScreenLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted">
      Carregando…
    </div>
  )
}

/** Só deixa passar se houver sessão; senão manda para /login. */
export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <FullScreenLoading />
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
