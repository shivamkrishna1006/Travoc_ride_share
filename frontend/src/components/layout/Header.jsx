import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button, Avatar } from '../common'

export default function Header() {
  const navigate = useNavigate()
  const { user, driver, logout, isRider, isDriver } = useAuth()

  const currentUser = isRider ? user : driver

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">RideHub</h1>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {isRider ? 'Rider' : isDriver ? 'Driver' : 'User'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <>
              <span className="text-sm text-gray-600">{currentUser.email}</span>
              {currentUser.profilePhoto && (
                <Avatar src={currentUser.profilePhoto} alt={currentUser.firstName} size="md" />
              )}
            </>
          )}
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
