import clsx from 'clsx'

export function Select({ label, error, options = [], placeholder, className = '', containerClassName = '', ...props }) {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <select
        className={clsx(
          'w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg transition-all duration-200',
          'focus:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-10',
          'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
