import { useEffect } from 'react'
import clsx from 'clsx'

export function BottomSheet({ isOpen, onClose, title, children, showHandle = true }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
        {showHandle && (
          <div className="flex justify-center pt-3">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
        )}
        {title && <div className="sticky top-0 px-4 py-3 border-b border-gray-100"><h3 className="font-semibold text-lg">{title}</h3></div>}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
