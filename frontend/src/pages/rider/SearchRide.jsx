import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Button, Spinner } from '../../components/common'
import RideRequestForm from '../../components/rider/RideRequestForm'
import LocationSearch from '../../components/rider/LocationSearch'
import FareEstimate from '../../components/rider/FareEstimate'
import { setActiveRide } from '../../store/slices/rideSlice'

export default function SearchRide() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [fare, setFare] = useState(null)
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [rideType, setRideType] = useState('economy')

  const handlePickupChange = (location) => {
    setPickup(location)
  }

  const handleDropoffChange = (location) => {
    setDropoff(location)
  }

  const calculateFare = async (pickupLoc, dropoffLoc, type) => {
    setLoading(true)
    try {
      // Mock fare calculation - in real app, call API
      const mockFare = {
        baseFare: 2.5,
        distance: Math.random() * 20 + 1,
        distanceFare: (Math.random() * 20 + 1) * 1.5,
        surgeFactor: Math.random() > 0.7 ? 1.5 : 1.0,
      }
      mockFare.total = mockFare.baseFare + mockFare.distanceFare * mockFare.surgeFactor
      setFare(mockFare)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestRide = async (data) => {
    setLoading(true)
    try {
      await calculateFare(data.pickup, data.dropoff, data.rideType)
      setPickup(data.pickup)
      setDropoff(data.dropoff)
      setRideType(data.rideType)

      // Mock ride creation
      const mockRide = {
        id: Math.random().toString(36).substr(2, 9),
        pickup: data.pickup,
        dropoff: data.dropoff,
        rideType: data.rideType,
        status: 'requested',
        fare: 15.99,
        createdAt: new Date(),
      }

      dispatch(setActiveRide(mockRide))
      navigate(`/rider/tracking/${mockRide.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Where to?</h1>
          <p className="text-gray-600">Book a ride in seconds</p>
        </div>

        {/* Main Form */}
        <div className="space-y-4">
          <Card padding="p-6" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Pickup Location
              </label>
              <LocationSearch
                placeholder="Enter pickup location"
                value={pickup}
                onSelect={handlePickupChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Dropoff Location
              </label>
              <LocationSearch
                placeholder="Enter dropoff location"
                value={dropoff}
                onSelect={handleDropoffChange}
              />
            </div>

            {pickup && dropoff && (
              <Button
                variant="primary"
                size="full"
                onClick={() =>
                  handleRequestRide({ pickup, dropoff, rideType })
                }
                disabled={loading}
              >
                {loading ? <Spinner /> : 'See Available Rides'}
              </Button>
            )}
          </Card>

          {fare && (
            <FareEstimate
              pickup={pickup}
              dropoff={dropoff}
              rideType={rideType}
              fare={fare}
              loading={loading}
            />
          )}
        </div>

        {/* Recent Rides */}
        <Card padding="p-6">
          <h3 className="font-semibold mb-4">Recent Locations</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium">📍 123 Main St</div>
              <div className="text-sm text-gray-600">Home</div>
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="font-medium">💼 456 Business Ave</div>
              <div className="text-sm text-gray-600">Work</div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
