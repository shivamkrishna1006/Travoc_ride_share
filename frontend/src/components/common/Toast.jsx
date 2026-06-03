import { useEffect } from 'react'
import clsx from 'clsx'

export function Toast({ message, type = 'info', onClose, duration = 3000, className = '' }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const variants = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  }

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 max-w-sm p-4 rounded-lg border-l-4 shadow-lg z-50',
        'animate-in slide-in-from-bottom-4 duration-300',
        variants[type],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-current hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
