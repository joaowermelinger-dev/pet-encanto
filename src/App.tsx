import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import ProtectedRoute from './auth/ProtectedRoute'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Placeholder from './pages/admin/Placeholder'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Placeholder title="Clientes" />} />
          <Route path="appointments" element={<Placeholder title="Agenda" />} />
          <Route path="services" element={<Placeholder title="Serviços" />} />
          <Route path="products" element={<Placeholder title="Produtos" />} />
          <Route path="sales" element={<Placeholder title="Vendas" />} />
          <Route path="gallery" element={<Placeholder title="Galeria" />} />
          <Route path="settings" element={<Placeholder title="Configurações" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
