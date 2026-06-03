import clsx from 'clsx'

export function Avatar({ src, alt = 'Avatar', size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        'rounded-full object-cover border-2 border-gray-200',
        sizes[size],
        className
      )}
    />
  )
}
