import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card } from '../../components/common'
import { NavigationGuide, PassengerInfo } from '../../components/driver'

export default function ActiveRide() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const [rideStatus, setRideStatus] = useState('en_route')
  const [eta, setEta] = useState(5)
  const [distance, setDistance] = useState(2.3)

  const mockRide = {
    id: rideId,
    pickup: '123 Main St, Downtown',
    dropoff: '456 Park Ave, Uptown',
    distance: 8.5,
    fare: 15.99,
  }

  const mockPassenger = {
    id: '123',
    name: 'John Doe',
    rating: 4.8,
    trips: 45,
    photo: 'https://via.placeholder.com/80',
    phone: '+1 (555) 123-4567',
    preferredSeating: 'Back seat',
    specialRequests: 'Please play soft music',
  }

  useEffect(() => {
    // Simulate live ETA updates
    const timer = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1))
      setDistance((prev) => Math.max(0, prev - 0.1))
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  const handleArrived = () => {
    setRideStatus('arrived')
    alert('Passenger notified: You have arrived!')
  }

  const handleCompleteRide = () => {
    navigate('/driver/dashboard')
  }

  const handleCall = () => {
    alert(`Calling ${mockPassenger.name}...`)
  }

  const handleMessage = () => {
    alert(`Message panel opening...`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Active Ride</h1>
          <p className="text-gray-600">Ride ID: {rideId}</p>
        </div>

        {/* Navigation Guide */}
        <NavigationGuide
          ride={mockRide}
          eta={`${eta} min`}
          distance={`${distance.toFixed(1)} km`}
          onArrived={handleArrived}
          onComplete={handleCompleteRide}
        />

        {/* Passenger Info */}
        <PassengerInfo
          passenger={mockPassenger}
          onCall={handleCall}
          onMessage={handleMessage}
        />

        {/* Ride Summary */}
        <Card padding="p-6" className="space-y-3">
          <h3 className="font-semibold">Ride Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Pickup</span>
              <span className="font-medium">{mockRide.pickup}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Dropoff</span>
              <span className="font-medium">{mockRide.dropoff}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Total Fare</span>
              <span className="font-bold text-green-600">${mockRide.fare}</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="text-gray-600">Distance</span>
              <span className="font-medium">{mockRide.distance} km</span>
            </div>
          </div>
        </Card>

        {/* Status Timeline */}
        <Card padding="p-6" className="space-y-3">
          <h3 className="font-semibold">Ride Status</h3>
          <div className="space-y-2">
            {['en_route', 'arrived', 'started', 'completed'].map((status) => (
              <div
                key={status}
                className={`p-3 rounded-lg border-2 transition-all ${
                  rideStatus === status || (rideStatus === 'en_route' && status === 'en_route')
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className="font-medium capitalize">
                  {status === 'en_route'
                    ? '🚗 En Route to Pickup'
                    : status === 'arrived'
                      ? '✓ Arrived at Pickup'
                      : status === 'started'
                        ? '🏁 Ride Started'
                        : '✓ Completed'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
