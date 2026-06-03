import { useState } from 'react'
import { Card, Badge, Button } from '../../components/common'
import { EarningsCard } from '../../components/driver'

export default function DriverEarnings() {
  const [period, setPeriod] = useState('today')

  const mockWeeklyStats = [95.50, 102.75, 89.25, 112.00, 98.50, 145.00, 0]
  const mockMonthlyStats = {
    totalEarnings: '$2,847.50',
    totalTrips: 234,
    avgPerTrip: 12.17,
  }

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ]

  const periodData = {
    today: { earnings: 145.00, trips: 12 },
    week: { earnings: 743.00, trips: 61 },
    month: { earnings: 2847.50, trips: 234 },
    all: { earnings: 12540.75, trips: 987 },
  }

  const data = periodData[period]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600">Track your income and performance</p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                period === p.id
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Main Earnings Card */}
        <Card padding="p-6" className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="space-y-2">
            <p className="text-green-100 text-sm">Total Earnings</p>
            <div className="text-5xl font-bold">${data.earnings.toFixed(2)}</div>
            <div className="pt-2">
              <Badge variant="success" className="bg-green-400 text-green-900">
                {data.trips} trips
              </Badge>
            </div>
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card padding="p-4" className="text-center">
            <p className="text-gray-600 text-xs font-medium mb-2">Average/Trip</p>
            <p className="text-2xl font-bold text-gray-900">
              ${data.trips > 0 ? (data.earnings / data.trips).toFixed(2) : '0.00'}
            </p>
          </Card>
          <Card padding="p-4" className="text-center">
            <p className="text-gray-600 text-xs font-medium mb-2">Acceptance Rate</p>
            <p className="text-2xl font-bold text-green-600">92%</p>
          </Card>
        </div>

        {/* Detailed Earnings Card */}
        <EarningsCard
          dailyEarnings={145.00}
          totalTrips={12}
          weeklyStats={mockWeeklyStats}
          monthlyStats={mockMonthlyStats}
        />

        {/* Breakdown Table */}
        <Card padding="p-6" className="space-y-4">
          <h3 className="font-semibold text-lg">Recent Earnings</h3>
          <div className="space-y-2">
            {[
              { trip: 'Downtown → Airport', fare: 18.50, time: '14:30', rating: 5 },
              { trip: 'Office → Coffee Shop', fare: 12.75, time: '13:15', rating: 4 },
              { trip: 'Mall → Station', fare: 15.25, time: '12:00', rating: 5 },
              { trip: 'Hospital → Hotel', fare: 22.50, time: '10:45', rating: 5 },
            ].map((ride, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{ride.trip}</div>
                  <div className="text-xs text-gray-600">{ride.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">${ride.fare}</div>
                  <div className="text-xs">⭐ {ride.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Incentives */}
        <Card padding="p-6" className="space-y-4 bg-blue-50 border-2 border-blue-200">
          <h3 className="font-semibold">Active Incentives</h3>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Complete 10 rides by EOD</div>
                  <div className="text-xs text-gray-600">Earn +$20 bonus</div>
                </div>
                <Badge variant="info">7/10</Badge>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Maintain 4.8+ rating</div>
                  <div className="text-xs text-gray-600">Unlock premium features</div>
                </div>
                <Badge variant="success">✓</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Payout */}
        <Card padding="p-6" className="space-y-4">
          <h3 className="font-semibold">Payout Method</h3>
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏦</div>
                <div>
                  <div className="font-medium">Bank Account</div>
                  <div className="text-sm text-gray-600">****1234</div>
                </div>
              </div>
              <Badge variant="success">Default</Badge>
            </div>
          </div>
          <Button variant="secondary" size="full">
            Withdraw Earnings
          </Button>
        </Card>
      </div>
    </div>
  )
}
