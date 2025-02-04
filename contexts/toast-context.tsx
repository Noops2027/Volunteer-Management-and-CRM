'use client'

import { createContext, useContext, useState } from 'react'
import { Toast } from '@/components/ui/toast'

type ToastType = 'success' | 'error' | 'info'

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  function showToast(message: string, type: ToastType = 'info') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
} 