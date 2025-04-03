import { Subscription, Transmit } from '@adonisjs/transmit-client'
import React, { createContext, useEffect, useState } from 'react'

// Définir le type pour le contexte
interface TransmitClientContextType {
  transmit: Transmit | undefined
  subscribeChannel: (channel: string) => Promise<Subscription>
  unsubscribeOnServer: (subscription: Subscription) => Promise<void>
}

// Créer le contexte avec des valeurs par défaut
export const TransmitClientContext = createContext<TransmitClientContextType>({
  transmit: undefined,
  subscribeChannel: async (_channel: string): Promise<Subscription> => {
    throw new Error('TransmitClientContext not initialized')
  },
  unsubscribeOnServer: async (_subscription: Subscription): Promise<void> => {},
})

export const TransmitClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [transmit, setTransmit] = useState<Transmit>()

  const subscribeChannel = async (channel: string): Promise<Subscription> => {
    if (!transmit) throw new Error('TransmitClientContext not initialized')
    const subscription = transmit.subscription(channel)
    await subscription.create()
    return subscription
  }

  const unsubscribeOnServer = async (subscription: Subscription): Promise<void> => {
    try {
      await subscription.delete()
    } catch (error) {
      console.error('[error] : Error while removing subscription', error)
    }
  }

  useEffect(() => {
    // Créez une seule instance de transmit
    const transmitInstance = new Transmit({
      baseUrl: window.location.origin,
    })

    setTransmit(transmitInstance)
    console.log('[info] : Transmit client initialized')

    // Nettoyage à la déconnexion
    return () => {
      transmitInstance.close()
    }
  }, [])

  return (
    <TransmitClientContext.Provider
      value={{
        transmit,
        subscribeChannel,
        unsubscribeOnServer,
      }}
    >
      {children}
    </TransmitClientContext.Provider>
  )
}

export const useTransmit = () => {
  return React.useContext(TransmitClientContext)
}
