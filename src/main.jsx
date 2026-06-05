import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { CollectionProvider } from './context/CollectionContext'
import { RadarProvider } from './context/RadarContext'
import { MatchesProvider } from './context/MatchesContext'
import Landing from './pages/Landing'
import Premium from './pages/Premium'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Album from './pages/Album'
import Radar from './pages/Radar'
import Negociacion from './pages/Negociacion'
import Matches from './pages/Matches'
import Perfil from './pages/Perfil'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated app shell (sidebar layout), gated by a valid token */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <CollectionProvider>
                  <RadarProvider>
                    <MatchesProvider>
                      <AppLayout />
                    </MatchesProvider>
                  </RadarProvider>
                </CollectionProvider>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/album" element={<Album />} />
              <Route path="/radar" element={<Radar />} />
              <Route path="/negociacion/:tradeId" element={<Negociacion />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Route>

          {/* Unknown routes fall back to the landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
