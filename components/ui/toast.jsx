"use client"

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export function Toast({ toast, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getIcon = () => {
    switch (toast.variant) {
      case 'destructive':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.variant) {
      case 'destructive':
        return 'bg-red-50 border-red-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${getBackgroundColor()}`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          {toast.title && (
            <h4 className="font-medium text-gray-900 mb-1">{toast.title}</h4>
          )}
          {toast.description && (
            <p className="text-sm text-gray-600">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function Toaster({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
} 