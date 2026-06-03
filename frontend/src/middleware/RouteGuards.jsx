import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-lg">Loading...</div></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

export function RoleRoute({ children, role }) {
  const { isAuthenticated, isRider, isDriver, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-lg">Loading...</div></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />

  const hasRole = (role === 'rider' && isRider) || (role === 'driver' && isDriver)
  if (!hasRole) return <Navigate to="/not-authorized" replace />

  return children
}
