import { ReactNode } from 'react'
import ToastProvider from '~/contexts/ToastContext'
import { TransmitClientProvider } from '~/contexts/TransmitContext'

const LayoutContextProviders = ({ children }: { children: ReactNode }) => {
  return (
    <TransmitClientProvider>
      <ToastProvider>{children}</ToastProvider>
    </TransmitClientProvider>
  )
}

export default LayoutContextProviders
