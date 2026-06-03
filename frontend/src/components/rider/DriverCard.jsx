import { Card, Avatar, Badge, Button } from '../common'

export default function DriverCard({ driver, eta, distance, onCancel, onCall }) {
  if (!driver) return null

  return (
    <Card padding="p-6" className="bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={driver.photo}
              name={driver.name}
              size="lg"
            />
            <div>
              <h3 className="font-bold text-lg">{driver.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="success">{driver.rating} ⭐</Badge>
                <span className="text-sm text-gray-600">{driver.trips} trips</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Vehicle</div>
            <div className="font-semibold">{driver.vehicleNumber}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 bg-white rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{eta}</div>
            <div className="text-xs text-gray-600">ETA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{distance}</div>
            <div className="text-xs text-gray-600">Away</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="full"
            onClick={onCall}
          >
            📞 Call
          </Button>
          <Button
            variant="danger"
            size="full"
            onClick={onCancel}
          >
            Cancel Ride
          </Button>
        </div>
      </div>
    </Card>
  )
}
