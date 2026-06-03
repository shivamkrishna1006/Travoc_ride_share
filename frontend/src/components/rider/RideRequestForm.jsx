import { useState } from 'react'
import { Button, Input, Card, Spinner } from '../common'

export default function RideRequestForm({ onSubmit, loading = false }) {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [rideType, setRideType] = useState('economy')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pickup && dropoff) {
      onSubmit({ pickup, dropoff, rideType })
    }
  }

  const rideTypes = [
    { id: 'economy', label: '🚗 Economy', price: '$' },
    { id: 'premium', label: '🚙 Premium', price: '$$' },
    { id: 'xl', label: '🚐 XL', price: '$$$' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card padding="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pickup Location</label>
            <Input
              type="text"
              placeholder="Where are you?"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dropoff Location</label>
            <Input
              type="text"
              placeholder="Where to?"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Ride Type</label>
            <div className="grid grid-cols-3 gap-3">
              {rideTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setRideType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    rideType === type.id
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs mt-1">{type.price}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="full"
            disabled={!pickup || !dropoff || loading}
          >
            {loading ? <Spinner /> : 'Request Ride'}
          </Button>
        </div>
      </Card>
    </form>
  )
}
