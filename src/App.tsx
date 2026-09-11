import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import ProtectedRoute from './auth/ProtectedRoute'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Updates from './pages/admin/Updates'
import Clients from './pages/admin/Clients'
import ClientDetail from './pages/admin/ClientDetail'
import Appointments from './pages/admin/Appointments'
import Clubinho from './pages/admin/Clubinho'
import Settings from './pages/admin/Settings'
import Placeholder from './pages/admin/Placeholder'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="clubinho" element={<Clubinho />} />
          <Route path="products" element={<Placeholder title="Produtos" />} />
          <Route path="sales" element={<Placeholder title="Vendas" />} />
          <Route path="gallery" element={<Placeholder title="Galeria" />} />
          <Route path="updates" element={<Updates />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
