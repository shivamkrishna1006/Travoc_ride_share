import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Header from './Header'
import BottomNav from './BottomNav'

export default function MainLayout() {
  const { isRider, isDriver } = useAuth()

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      {(isRider || isDriver) && <BottomNav />}
    </div>
  )
}
