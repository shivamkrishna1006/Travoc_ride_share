import { useState } from 'react'
import clsx from 'clsx'

export function Ratings({ value = 0, onChange, readOnly = false, size = 'md', className = '' }) {
  const [hovered, setHovered] = useState(0)

  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  }

  const displayValue = hovered || value

  return (
    <div className={clsx('flex gap-1', className)}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => !readOnly && onChange(star)}
          className={clsx(
            sizes[size],
            'transition-all duration-200 cursor-pointer',
            !readOnly && 'hover:scale-110'
          )}
        >
          <svg
            className={clsx(
              'w-full h-full',
              star <= displayValue ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
            )}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}
