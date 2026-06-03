import clsx from 'clsx'

export function Input({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  containerClassName = '',
  value,
  onChange,
  disabled = false,
  icon: Icon,
  ...props
}) {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg transition-all duration-200',
            'focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-10',
            'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500',
            Icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
