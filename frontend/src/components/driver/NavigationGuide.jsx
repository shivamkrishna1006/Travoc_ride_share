import { Card, Badge, Button } from '../common'

export default function NavigationGuide({ ride, eta, distance, onArrived, onComplete }) {
  return (
    <Card padding="p-6" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Navigation</h3>
        <Badge variant="info">{eta} mins</Badge>
      </div>

      {/* Route Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg space-y-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📍</div>
          <div className="flex-1">
            <div className="text-xs text-gray-600 font-medium">PICKUP</div>
            <div className="font-semibold">{ride.pickup}</div>
          </div>
        </div>

        <div className="border-l-2 border-gray-300 ml-4 pl-3 py-2 text-xs text-gray-600">
          {distance} away • {eta} min drive
        </div>

        <div className="flex items-start gap-3">
          <div className="text-2xl">🎯</div>
          <div className="flex-1">
            <div className="text-xs text-gray-600 font-medium">DROPOFF</div>
            <div className="font-semibold">{ride.dropoff}</div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-2">🗺️</div>
          <p className="text-sm text-gray-600">Live Map (Mapbox)</p>
        </div>
      </div>

      {/* Turn by Turn */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm font-medium mb-2">Next Turn</div>
        <div className="flex items-center gap-2">
          <div className="text-2xl">➡️</div>
          <span className="font-medium">Turn right on Main St</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">500m ahead</div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" size="full" onClick={onArrived}>
          ✓ Arrived
        </Button>
        <Button variant="primary" size="full" onClick={onComplete}>
          Complete Ride
        </Button>
      </div>
    </Card>
  )
}
