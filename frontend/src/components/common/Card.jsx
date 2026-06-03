import clsx from 'clsx'

export function Card({ children, className = '', padding = 'p-4', shadow = true, hoverable = false }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg',
        padding,
        shadow && 'shadow-md',
        hoverable && 'hover:shadow-lg transition-shadow duration-200 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
