import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

// Shell for the authenticated app: fixed sidebar + scrollable content region.
// Used as a layout route in main.jsx — child routes render through <Outlet />.
function AppLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
