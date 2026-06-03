import { Card, Avatar, Badge, Button } from '../common'

export default function PassengerInfo({ passenger, onCall, onMessage }) {
  return (
    <Card padding="p-6" className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar src={passenger?.photo} name={passenger?.name} size="lg" />
          <div>
            <h3 className="text-lg font-bold">{passenger?.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="success">⭐ {passenger?.rating}</Badge>
              <span className="text-sm text-gray-600">{passenger?.trips} trips</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCall}
            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200"
          >
            ☎️
          </button>
          <button
            onClick={onMessage}
            className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200"
          >
            💬
          </button>
        </div>
      </div>

      {/* Passenger Details */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
        <div>
          <div className="text-gray-600 text-xs">Phone</div>
          <div className="font-medium">{passenger?.phone}</div>
        </div>
        <div>
          <div className="text-gray-600 text-xs">Preferred Seating</div>
          <div className="font-medium">{passenger?.preferredSeating || 'Back seat'}</div>
        </div>
      </div>

      {/* Special Requests */}
      {passenger?.specialRequests && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <div className="text-sm font-medium text-yellow-900">Special Requests</div>
          <div className="text-sm text-yellow-800 mt-1">{passenger?.specialRequests}</div>
        </div>
      )}
    </Card>
  )
}
