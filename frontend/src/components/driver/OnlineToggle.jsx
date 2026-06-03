import { useState } from 'react'
import { Card, Button } from '../common'

export default function OnlineToggle({ isOnline = false, onToggle, onlineRides = 0 }) {
  const [toggling, setToggling] = useState(false)

  const handleToggle = async () => {
    setToggling(true)
    await onToggle?.(!isOnline)
    setToggling(false)
  }

  return (
    <Card padding="p-6" className={`${isOnline ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isOnline ? `${onlineRides} ride(s) waiting` : 'No rides available'}
          </p>
        </div>

        <Button
          variant={isOnline ? 'danger' : 'primary'}
          onClick={handleToggle}
          disabled={toggling}
        >
          {toggling ? '...' : isOnline ? 'Go Offline' : 'Go Online'}
        </Button>
      </div>

      {isOnline && (
        <div className="mt-4 p-3 bg-green-100 rounded-lg">
          <p className="text-sm text-green-900 font-medium">
            ✓ You're accepting ride requests
          </p>
        </div>
      )}
    </Card>
  )
}
