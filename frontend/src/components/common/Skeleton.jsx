import clsx from 'clsx'

export function Skeleton({ width = 'w-full', height = 'h-4', rounded = 'rounded', className = '' }) {
  return (
    <div
      className={clsx(
        'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse',
        width,
        height,
        rounded,
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <Skeleton height="h-8" className="mb-3" />
      <Skeleton height="h-4" className="mb-2" />
      <Skeleton height="h-4" width="w-2/3" />
    </div>
  )
}
