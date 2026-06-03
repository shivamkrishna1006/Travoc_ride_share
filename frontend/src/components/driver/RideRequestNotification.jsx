import { useState } from 'react'
import { Card, Button, Badge, Avatar } from '../common'

export default function RideRequestNotification({ ride, onAccept, onReject }) {
  const [accepting, setAccepting] = useState(false)

  const handleAccept = async () => {
    setAccepting(true)
    await onAccept?.(ride.id)
    setAccepting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <Card padding="p-6" className="w-full rounded-t-2xl space-y-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">New Ride Request</h3>
          <button
            onClick={() => onReject?.(ride.id)}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Ride Details */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📍</div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Pickup</div>
              <div className="font-semibold">{ride.pickup}</div>
            </div>
            <div className="text-xs bg-white px-2 py-1 rounded">
              {ride.distance} km
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Dropoff</div>
                <div className="font-semibold">{ride.dropoff}</div>
              </div>
              <div className="text-xs bg-white px-2 py-1 rounded">
                ~{ride.eta} min
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar src={ride.passengerPhoto} name={ride.passengerName} size="sm" />
            <div>
              <div className="font-medium">{ride.passengerName}</div>
              <div className="text-xs text-gray-600">⭐ {ride.passengerRating}</div>
            </div>
          </div>
          <Badge variant="success">${ride.fare}</Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="full"
            onClick={() => onReject?.(ride.id)}
          >
            Reject
          </Button>
          <Button
            variant="primary"
            size="full"
            onClick={handleAccept}
            disabled={accepting}
          >
            {accepting ? '...' : 'Accept Ride'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
