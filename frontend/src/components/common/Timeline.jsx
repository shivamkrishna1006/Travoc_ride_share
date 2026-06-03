import clsx from 'clsx'

export function Timeline({ items = [], currentStep = 0, vertical = true }) {
  return (
    <div className={clsx('flex', vertical ? 'flex-col' : 'flex-row')}>
      {items.map((item, idx) => (
        <div
          key={idx}
          className={clsx('flex', vertical ? 'flex-row' : 'flex-col', 'items-start')}
        >
          <div className="flex flex-col items-center">
            <div
              className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-200',
                idx <= currentStep
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              )}
            >
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            {idx < items.length - 1 && (
              <div
                className={clsx(
                  vertical ? 'w-1 h-12' : 'h-1 w-12',
                  'my-2',
                  idx < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
          <div className={clsx(vertical ? 'ml-4' : 'mt-2', 'flex-1')}>
            <p className="font-medium text-gray-900">{item.label}</p>
            {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
