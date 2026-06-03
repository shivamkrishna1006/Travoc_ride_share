import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isRider, isDriver } = useAuth()

  const riderNavs = [
    { label: 'Home', path: '/rider/dashboard', icon: '🏠' },
    { label: 'Book', path: '/rider/search', icon: '🔍' },
    { label: 'History', path: '/rider/history', icon: '📜' },
    { label: 'Profile', path: '/rider/profile', icon: '👤' },
  ]

  const driverNavs = [
    { label: 'Home', path: '/driver/dashboard', icon: '🏠' },
    { label: 'Earnings', path: '/driver/earnings', icon: '💰' },
    { label: 'History', path: '/driver/history', icon: '📜' },
    { label: 'Profile', path: '/driver/profile', icon: '👤' },
  ]

  const navs = isRider ? riderNavs : driverNavs

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 flex items-center justify-around">
      {navs.map(nav => (
        <button
          key={nav.path}
          onClick={() => navigate(nav.path)}
          className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
            location.pathname.includes(nav.path)
              ? 'text-black bg-gray-50'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          <span className="text-xl">{nav.icon}</span>
          <span>{nav.label}</span>
        </button>
      ))}
    </nav>
  )
}
