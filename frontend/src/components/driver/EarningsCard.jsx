import { Card, Badge } from '../common'

export default function EarningsCard({ dailyEarnings, totalTrips, weeklyStats, monthlyStats }) {
  return (
    <Card padding="p-6" className="space-y-6">
      <div className="space-y-2">
        <div className="text-sm text-gray-600">Total Earnings Today</div>
        <div className="text-4xl font-bold text-green-600">${dailyEarnings || '0.00'}</div>
        <div className="flex items-center gap-2">
          <Badge variant="success">{totalTrips} trips</Badge>
          <span className="text-sm text-gray-600">+12% from yesterday</span>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Weekly Breakdown</h4>
        <div className="grid grid-cols-7 gap-2">
          {weeklyStats?.map((day, idx) => (
            <div key={idx} className="text-center">
              <div className="text-xs font-medium text-gray-600 mb-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
              </div>
              <div className="bg-gradient-to-t from-green-500 to-green-400 rounded h-16 relative">
                <div className="absolute bottom-2 left-0 right-0 text-xs text-white font-bold">
                  ${day}
                </div>
              </div>
            </div>
          )) || <div className="col-span-7 text-center text-gray-600">Loading...</div>}
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Monthly Summary</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {monthlyStats?.totalEarnings || '$0'}
            </div>
            <div className="text-xs text-gray-600 mt-1">Total Earned</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {monthlyStats?.totalTrips || '0'}
            </div>
            <div className="text-xs text-gray-600 mt-1">Total Trips</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${monthlyStats?.avgPerTrip || '0.00'}
            </div>
            <div className="text-xs text-gray-600 mt-1">Avg per Trip</div>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="font-medium mb-3">Performance Metrics</div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Acceptance Rate</span>
            <span className="font-medium">92%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }} />
          </div>

          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-600">Cancellation Rate</span>
            <span className="font-medium">2%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '2%' }} />
          </div>
        </div>
      </div>
    </Card>
  )
}
