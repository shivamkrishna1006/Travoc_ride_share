import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Card, Button } from '../../components/common'
import RideStatus from '../../components/rider/RideStatus'
import DriverCard from '../../components/rider/DriverCard'

export default function RideTracking() {
  const { rideId } = useParams()
  const navigate = useNavigate()
  const activeRide = useSelector((state) => state.ride.activeRide)
  const [rideStatus, setRideStatus] = useState('requested')
  const [driver, setDriver] = useState(null)
  const [eta, setEta] = useState('5 min')
  const [distance, setDistance] = useState('2.3 km')

  useEffect(() => {
    // Mock live updates simulation
    const timer = setInterval(() => {
      setRideStatus((prev) => {
        const statuses = ['requested', 'accepted', 'arriving', 'started', 'completed']
        const currentIdx = statuses.indexOf(prev)
        return statuses[(currentIdx + 1) % statuses.length]
      })

      setEta(Math.max(0, parseInt(eta) - 1) + ' min')
      setDistance((Math.random() * 2 + 0.5).toFixed(1) + ' km')
    }, 5000)

    return () => clearInterval(timer)
  }, [eta])

  useEffect(() => {
    // Mock driver assignment
    if (rideStatus === 'accepted' && !driver) {
      setDriver({
        id: '123',
        name: 'John Smith',
        rating: 4.8,
        trips: 1250,
        photo: 'https://via.placeholder.com/60',
        vehicleNumber: 'ABC-1234',
        vehicleType: 'Honda Civic',
      })
    }
  }, [rideStatus, driver])

  const handleCancelRide = () => {
    navigate('/rider/dashboard')
  }

  const handleCallDriver = () => {
    alert('Calling driver: +1 (555) 123-4567')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Ride</h1>
          <p className="text-gray-600">Ride ID: {rideId}</p>
        </div>

        {/* Live Map Placeholder */}
        <Card padding="p-0" className="overflow-hidden h-64 bg-gray-200">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-gray-700 font-medium">Live Map</p>
              <p className="text-sm text-gray-600">(Mapbox integration coming)</p>
            </div>
          </div>
        </Card>

        {/* Status Timeline */}
        <RideStatus status={rideStatus} ride={activeRide} />

        {/* Driver Card - Show when accepted */}
        {driver && (
          <DriverCard
            driver={driver}
            eta={eta}
            distance={distance}
            onCancel={handleCancelRide}
            onCall={handleCallDriver}
          />
        )}

        {/* Waiting for Driver - Show when requested */}
        {rideStatus === 'requested' && !driver && (
          <Card padding="p-6" className="text-center space-y-4">
            <div className="text-3xl animate-pulse">🔄</div>
            <h3 className="font-semibold">Finding a driver...</h3>
            <p className="text-sm text-gray-600">
              You'll get notified when a driver accepts your request
            </p>
            <Button variant="secondary" size="full" onClick={handleCancelRide}>
              Cancel Request
            </Button>
          </Card>
        )}

        {/* Ride Completed */}
        {rideStatus === 'completed' && (
          <Card padding="p-6" className="text-center space-y-4 bg-green-50">
            <div className="text-4xl">✓</div>
            <h3 className="text-xl font-semibold text-gray-900">Ride Completed!</h3>
            <p className="text-gray-600">Thank you for choosing our service</p>
            <Button
              variant="primary"
              size="full"
              onClick={() => navigate('/rider/dashboard')}
            >
              Back to Home
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
