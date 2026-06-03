import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification, clearNotification } from '../store/slices/uiSlice'

export function useNotification() {
  const dispatch = useDispatch()

  const showNotification = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = Date.now()

      dispatch(
        setNotification({
          id,
          message,
          type,
          visible: true,
        })
      )

      if (duration > 0) {
        setTimeout(() => {
          dispatch(clearNotification(id))
        }, duration)
      }

      return id
    },
    [dispatch]
  )

  const success = useCallback(
    (message, duration = 3000) => {
      return showNotification(message, 'success', duration)
    },
    [showNotification]
  )

  const error = useCallback(
    (message, duration = 5000) => {
      return showNotification(message, 'error', duration)
    },
    [showNotification]
  )

  const warning = useCallback(
    (message, duration = 4000) => {
      return showNotification(message, 'warning', duration)
    },
    [showNotification]
  )

  const info = useCallback(
    (message, duration = 3000) => {
      return showNotification(message, 'info', duration)
    },
    [showNotification]
  )

  const dismiss = useCallback(
    (id) => {
      dispatch(clearNotification(id))
    },
    [dispatch]
  )

  return {
    showNotification,
    success,
    error,
    warning,
    info,
    dismiss,
  }
}
