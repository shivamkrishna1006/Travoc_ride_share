import { useState } from 'react'
import { Card, Button, TextArea, Avatar } from '../common'

export default function RideRating({ driver, ride, onSubmit, loading = false }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return
    await onSubmit?.({ rating, review })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card padding="p-8" className="text-center space-y-4">
        <div className="text-4xl">✓</div>
        <h3 className="text-xl font-semibold">Thank you!</h3>
        <p className="text-gray-600">Your rating helps {driver?.name} improve their service</p>
      </Card>
    )
  }

  return (
    <Card padding="p-6" className="space-y-6">
      <div className="text-center space-y-3">
        <Avatar src={driver?.photo} name={driver?.name} size="xl" />
        <h3 className="text-lg font-semibold">How was your ride?</h3>
        <p className="text-sm text-gray-600">Rate your experience with {driver?.name}</p>
      </div>

      {/* Star Rating */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-4xl transition-transform hover:scale-110 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Rating Text */}
      <div className="text-center">
        <p className="text-sm font-medium">
          {rating === 0
            ? 'Tap to rate'
            : rating <= 2
              ? '😞 Poor'
              : rating === 3
                ? '😐 Average'
                : rating === 4
                  ? '😊 Good'
                  : '😍 Excellent'}
        </p>
      </div>

      {/* Review Text */}
      {rating >= 3 && (
        <TextArea
          placeholder="Share your feedback (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          maxLength={200}
        />
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" size="full" disabled={loading}>
          Skip
        </Button>
        <Button
          variant="primary"
          size="full"
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </Button>
      </div>
    </Card>
  )
}
