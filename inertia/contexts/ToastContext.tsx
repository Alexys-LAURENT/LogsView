import { createContext, useContext } from 'react'
import { Toaster, toast } from 'sonner'

type ToastOptions = {
  description?: string
  duration?: number
  closeButton?: boolean
  richColors?: boolean
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
}

const defaultOptions = (options?: ToastOptions) => ({
  description: options?.description || new Date().toLocaleTimeString(),
  duration: options?.duration || 50000,
  closeButton: options?.closeButton === false ? false : true,
  richColors: options?.richColors === false ? false : true,
  position: options?.position || 'top-right',
})

const createCustomToast = () => ({
  default: (message: string, options?: ToastOptions) => toast(message, defaultOptions(options)),
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, defaultOptions(options)),
  error: (message: string, options?: ToastOptions) => toast.error(message, defaultOptions(options)),
  warning: (message: string, options?: ToastOptions) =>
    toast.warning(message, defaultOptions(options)),
  info: (message: string, options?: ToastOptions) => toast.info(message, defaultOptions(options)),
  promise: (
    promise: Promise<any>,
    successMessage: string,
    errorMessage: string,
    options?: ToastOptions
  ) => {
    toast.promise(promise, {
      loading: 'Chargement...',
      ...defaultOptions(options),
      success: successMessage,
      error: errorMessage,
    })
  },
})

export const ToastContext = createContext(createCustomToast())

export const useToast = () => {
  return useContext(ToastContext)
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const customToast = createCustomToast()

  return (
    <ToastContext.Provider value={customToast}>
      <Toaster />
      {children}
    </ToastContext.Provider>
  )
}

export default ToastProvider
