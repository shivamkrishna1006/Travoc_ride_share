import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Card, Avatar, Badge } from '../../components/common'

export default function RiderDashboard() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const activeRide = useSelector((state) => state.ride.activeRide)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header with User Info */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Where to,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-600">
                {user?.firstName || 'Rider'}
              </span>
              ?
            </h1>
            <p className="text-gray-600 mt-1">Good morning! 👋</p>
          </div>
          <Avatar src={user?.photo} name={user?.firstName} size="lg" />
        </div>

        {/* Quick Book Button */}
        <Card padding="p-6" className="bg-gradient-to-br from-black to-gray-800 text-white">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-300 mb-1">Quick Book</p>
              <h2 className="text-2xl font-bold">Book a ride now</h2>
            </div>
            <Button
              variant="primary"
              size="full"
              onClick={() => navigate('/rider/search')}
              className="bg-white text-black hover:bg-gray-100"
            >
              🔍 Search Ride
            </Button>
          </div>
        </Card>

        {/* Active Ride Status */}
        {activeRide && (
          <Card padding="p-6" className="bg-blue-50 border-2 border-blue-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-blue-900">Active Ride</h3>
                <Badge variant="info">In Progress</Badge>
              </div>
              <div className="text-sm text-blue-800">
                <div>From: {activeRide.pickup}</div>
                <div>To: {activeRide.dropoff}</div>
              </div>
              <Button
                variant="secondary"
                size="full"
                onClick={() => navigate(`/rider/ride/${activeRide.id}`)}
              >
                View Details
              </Button>
            </div>
          </Card>
        )}

        {/* Saved Places */}
        <Card padding="p-6">
          <h3 className="font-semibold mb-4">Saved Places</h3>
          <div className="space-y-2">
            <button
              onClick={() =>
                navigate('/rider/search')
              }
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="font-medium">🏠 Home</div>
              <div className="text-sm text-gray-600">123 Main St, Downtown</div>
            </button>
            <button
              onClick={() =>
                navigate('/rider/search')
              }
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="font-medium">💼 Work</div>
              <div className="text-sm text-gray-600">456 Business Ave, Uptown</div>
            </button>
          </div>
        </Card>

        {/* Recent Rides */}
        <Card padding="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Recent Rides</h3>
            <button
              onClick={() => navigate('/rider/history')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/rider/history')}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <div className="font-medium">Downtown → Airport</div>
              <div className="text-sm text-gray-600">May 28 • $15.99</div>
            </button>
            <button
              onClick={() => navigate('/rider/history')}
              className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <div className="font-medium">Office → Coffee Shop</div>
              <div className="text-sm text-gray-600">May 27 • $8.50</div>
            </button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            padding="p-6"
            onClick={() => navigate('/rider/profile')}
            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">👤</div>
            <div className="font-medium text-sm">Profile</div>
          </Card>
          <Card
            padding="p-6"
            onClick={() => navigate('/rider/history')}
            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">📜</div>
            <div className="font-medium text-sm">History</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
