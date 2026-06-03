import { useState, useEffect } from 'react'
import { Card, Badge, Spinner } from '../../components/common'

export default function RideHistory() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock fetch ride history
    setTimeout(() => {
      const mockRides = [
        {
          id: '1',
          pickup: '123 Main St, Downtown',
          dropoff: '456 Park Ave, Uptown',
          date: '2024-05-28',
          time: '14:30',
          driver: 'John Smith',
          rating: 5,
          fare: 15.99,
          distance: 8.5,
          duration: '18 min',
        },
        {
          id: '2',
          pickup: '789 Oak Rd, Riverside',
          dropoff: '321 River Blvd, Downtown',
          date: '2024-05-27',
          time: '09:15',
          driver: 'Sarah Johnson',
          rating: 4,
          fare: 12.50,
          distance: 6.2,
          duration: '14 min',
        },
        {
          id: '3',
          pickup: '654 Hill St, Hillside',
          dropoff: '987 Valley Ln, Downtown',
          date: '2024-05-26',
          time: '19:45',
          driver: 'Mike Davis',
          rating: 5,
          fare: 18.75,
          distance: 10.1,
          duration: '22 min',
        },
      ]
      setRides(mockRides)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Ride History</h1>
          <p className="text-gray-600">{rides.length} rides completed</p>
        </div>

        {rides.length === 0 ? (
          <Card padding="p-8" className="text-center space-y-4">
            <div className="text-4xl">🚗</div>
            <p className="text-gray-600">No rides yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {rides.map((ride) => (
              <Card
                key={ride.id}
                padding="p-4"
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {ride.pickup.split(',')[0]}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        →
                        <span>{ride.dropoff.split(',')[0]}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">${ride.fare}</div>
                      <div className="text-sm text-gray-600">{ride.distance} km</div>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex justify-between items-center text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-600">
                        {ride.date} • {ride.time}
                      </div>
                      <div className="text-gray-600">Driver: {ride.driver}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">
                        ⭐ {ride.rating}
                      </Badge>
                      <div className="text-xs text-gray-600">{ride.duration}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
