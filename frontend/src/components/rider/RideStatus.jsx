import { Card, Badge, Timeline } from '../common'

const statusSteps = [
  { id: 'requested', label: 'Ride Requested', icon: '📍' },
  { id: 'accepted', label: 'Driver Accepted', icon: '✓' },
  { id: 'arriving', label: 'Driver Arriving', icon: '🚗' },
  { id: 'started', label: 'Ride Started', icon: '🚕' },
  { id: 'completed', label: 'Ride Completed', icon: '✓' },
]

export default function RideStatus({ status = 'requested', ride }) {
  const currentStepIndex = statusSteps.findIndex((s) => s.id === status)

  return (
    <Card padding="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Ride Status</h3>
            <Badge variant={status === 'completed' ? 'success' : 'info'}>
              {statusSteps.find((s) => s.id === status)?.label}
            </Badge>
          </div>

          <div className="space-y-3">
            {statusSteps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    idx <= currentStepIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-sm transition-all ${
                    idx <= currentStepIndex ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
                {idx <= currentStepIndex && idx < currentStepIndex && (
                  <div className="ml-auto text-xs text-gray-400">✓ Complete</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {ride && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup</span>
              <span className="font-medium">{ride.pickup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dropoff</span>
              <span className="font-medium">{ride.dropoff}</span>
            </div>
            {ride.fare && (
              <div className="flex justify-between border-t pt-2 mt-2 font-semibold">
                <span>Total Fare</span>
                <span className="text-green-600">${ride.fare.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
