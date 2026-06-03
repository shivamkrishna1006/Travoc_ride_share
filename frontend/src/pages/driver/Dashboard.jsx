import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Card, Badge, Avatar, Spinner } from '../../components/common'
import { OnlineToggle, RideRequestNotification } from '../../components/driver'

export default function DriverDashboard() {
  const navigate = useNavigate()
  const driver = useSelector((state) => state.auth.driver)
  const [isOnline, setIsOnline] = useState(false)
  const [availableRides, setAvailableRides] = useState([])
  const [currentRequest, setCurrentRequest] = useState(null)
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [totalTrips, setTotalTrips] = useState(0)

  useEffect(() => {
    // Mock available rides
    if (isOnline) {
      const mockRides = [
        {
          id: '1',
          pickup: '123 Main St, Downtown',
          dropoff: '456 Park Ave, Uptown',
          distance: 8.5,
          eta: 5,
          fare: 15.99,
          passengerName: 'John Doe',
          passengerRating: 4.8,
          passengerPhoto: 'https://via.placeholder.com/40',
        },
        {
          id: '2',
          pickup: '789 Oak Rd, Riverside',
          dropoff: '321 River Blvd, Downtown',
          distance: 6.2,
          eta: 8,
          fare: 12.50,
          passengerName: 'Jane Smith',
          passengerRating: 4.9,
          passengerPhoto: 'https://via.placeholder.com/40',
        },
      ]
      setAvailableRides(mockRides)

      // Simulate incoming request
      const timer = setTimeout(() => {
        if (mockRides.length > 0) {
          setCurrentRequest(mockRides[0])
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isOnline])

  const handleToggleOnline = async (online) => {
    setIsOnline(online)
    if (!online) {
      setCurrentRequest(null)
      setAvailableRides([])
    }
  }

  const handleAcceptRide = async (rideId) => {
    navigate(`/driver/active/${rideId}`)
  }

  const handleRejectRide = (rideId) => {
    setCurrentRequest(null)
    // Simulate next request
    setTimeout(() => {
      if (availableRides.length > 1) {
        setCurrentRequest(availableRides[1])
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {driver?.firstName || 'Driver'}
            </h1>
            <p className="text-gray-600 mt-1">Ready to earn?</p>
          </div>
          <Avatar src={driver?.photo} name={driver?.firstName} size="lg" />
        </div>

        {/* Online/Offline Toggle */}
        <OnlineToggle
          isOnline={isOnline}
          onToggle={handleToggleOnline}
          onlineRides={availableRides.length}
        />

        {/* Income Summary */}
        {isOnline && (
          <Card padding="p-6" className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-green-600 font-medium">Today's Earnings</p>
                  <p className="text-3xl font-bold text-green-700">${todayEarnings.toFixed(2)}</p>
                </div>
                <Badge variant="success">{totalTrips} trips</Badge>
              </div>
              <div className="text-sm text-green-600">
                Average: ${totalTrips > 0 ? (todayEarnings / totalTrips).toFixed(2) : '0.00'} per trip
              </div>
            </div>
          </Card>
        )}

        {/* Available Rides */}
        {isOnline && availableRides.length > 0 && (
          <Card padding="p-6" className="space-y-3">
            <h3 className="font-semibold">Available Rides Near You</h3>
            <div className="space-y-2">
              {availableRides.slice(0, 2).map((ride) => (
                <div
                  key={ride.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{ride.pickup}</div>
                    <Badge variant="success">${ride.fare}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">→ {ride.dropoff}</div>
                  <div className="flex gap-2 text-xs text-gray-600">
                    <span>{ride.distance} km</span>
                    <span>•</span>
                    <span>{ride.eta} min pickup</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Offline State */}
        {!isOnline && (
          <Card padding="p-8" className="text-center space-y-4 bg-gray-50">
            <div className="text-4xl">🔴</div>
            <h3 className="font-bold text-lg">You're Offline</h3>
            <p className="text-gray-600">
              Go online to start accepting ride requests and earning
            </p>
            <Button variant="primary" size="full" onClick={() => handleToggleOnline(true)}>
              Go Online Now
            </Button>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Card
            padding="p-4"
            onClick={() => navigate('/driver/earnings')}
            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-medium text-xs">Earnings</div>
          </Card>
          <Card
            padding="p-4"
            onClick={() => navigate('/driver/history')}
            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-2xl mb-2">📜</div>
            <div className="font-medium text-xs">History</div>
          </Card>
          <Card
            padding="p-4"
            onClick={() => navigate('/driver/profile')}
            className="text-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-medium text-xs">Profile</div>
          </Card>
        </div>

        {/* Vehicle Status */}
        <Card padding="p-6" className="space-y-3">
          <h3 className="font-semibold">Vehicle Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-gray-600">Vehicle</span>
              <span className="font-medium">{driver?.vehicle?.make} {driver?.vehicle?.model}</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-gray-600">License Plate</span>
              <span className="font-medium">{driver?.vehicle?.licensePlate}</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span className="text-sm text-gray-600">Documents</span>
              <Badge variant="success">✓ Verified</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Ride Request Notification */}
      {currentRequest && (
        <RideRequestNotification
          ride={currentRequest}
          onAccept={handleAcceptRide}
          onReject={handleRejectRide}
        />
      )}
    </div>
  )
}
