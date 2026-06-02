import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Premium from './pages/Premium'
import Dashboard from './pages/Dashboard'
import Album from './pages/Album'
import Radar from './pages/Radar'
import Negociacion from './pages/Negociacion'
import Perfil from './pages/Perfil'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/premium" element={<Premium />} />

        {/* Authenticated app shell (sidebar layout) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/album" element={<Album />} />
          <Route path="/radar" element={<Radar />} />
          <Route path="/negociacion" element={<Negociacion />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>

        {/* Unknown routes fall back to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
