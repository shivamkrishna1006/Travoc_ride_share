import { Card, Badge } from '../common'

export default function FareEstimate({ pickup, dropoff, rideType, fare, loading }) {
  if (!fare && !loading) return null

  const rideTypeLabels = {
    economy: '🚗 Economy',
    premium: '🚙 Premium',
    xl: '🚐 XL',
  }

  return (
    <Card padding="p-6" className="bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Fare Estimate</h3>
          <Badge variant="success">{rideTypeLabels[rideType]}</Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{pickup}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{dropoff}</span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Fare</span>
            <span>${fare?.baseFare?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Distance ({fare?.distance?.toFixed(1)} km)</span>
            <span>${fare?.distanceFare?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Surge</span>
            <span className="text-red-600">×{fare?.surgeFactor || '1.0'}</span>
          </div>
        </div>

        <div className="border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-600">${fare?.total?.toFixed(2) || '0.00'}</span>
        </div>

        <p className="text-xs text-gray-500">Final fare may vary based on actual route</p>
      </div>
    </Card>
  )
}
