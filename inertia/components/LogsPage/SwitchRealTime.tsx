import { SharedProps } from '@adonisjs/inertia/types'
import { Subscription } from '@adonisjs/transmit-client'
import { router, usePage } from '@inertiajs/react'
import { DateTime } from 'luxon'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { useTransmit } from '~/contexts/TransmitContext'
import { Switch } from '../ui/switch'
import { Log } from './LogsTableColumns'

const SwitchRealTime = ({ setLogsState }: { setLogsState: Dispatch<SetStateAction<Log[]>> }) => {
  const { qs, DEFAULT_LOGS_COUNT_PER_PAGE } = usePage<SharedProps>().props
  const { transmit, subscribeChannel, unsubscribeOnServer } = useTransmit()
  const [isRealTimeActive, setIsRealTimeActive] = useState(false)
  const [isRealTimeAllowed, setIsRealTimeAllowed] = useState(false)
  const subscription = useRef<Subscription | undefined>(undefined)
  const stopListeningOnSocketClient = useRef<() => void | undefined>(undefined)

  // This function unsubscribes the subscription on the server and stops listening to it on the client
  const stopListening = async () => {
    if (subscription.current === undefined) return
    if (stopListeningOnSocketClient.current === undefined) return
    await unsubscribeOnServer(subscription.current)
    stopListeningOnSocketClient.current()
    setIsRealTimeActive(false)
    subscription.current = undefined
    stopListeningOnSocketClient.current = undefined
    console.log(' [realTime Logs] : Subscription removed')
  }

  // This function subscribes to the channel and starts listening to it
  // It also stores the stopListening function in stopListeningOnSocketClient.current in order to be able to stop listening to the channel on stopListening function
  const startListening = async () => {
    if (!transmit) return
    if (subscription.current !== undefined) return
    subscription.current = await subscribeChannel('logs_realtime')
    const stopListening = subscription.current.onMessage((data: string) => {
      const newLog = JSON.parse(data) as Log
      handleAddNewLog(newLog)
    })
    stopListeningOnSocketClient.current = stopListening
    setIsRealTimeActive(true)
    console.log(' [realTime Logs] : Subscription created')
  }

  useEffect(() => {
    if (!transmit) return

    // On nettoie d'abord toute souscription existante
    if (subscription.current !== undefined) {
      stopListening()
    }

    // Puis on vérifie si nous on peut activer le temps réel
    if (
      (qs.page === undefined || qs.page === '1') &&
      (qs.order === 'desc' || qs.order === undefined)
    ) {
      // On utilise setTimeout pour s'assurer que le nettoyage (return du useEffect) précédent est terminé
      setTimeout(() => {
        startListening()
        setIsRealTimeAllowed(true)
      }, 200)
    } else {
      setIsRealTimeAllowed(false)
    }

    // On nettoie la souscription quand le composant est démonté
    return () => {
      stopListening()
    }
  }, [transmit, qs])

  const handleAddNewLog = (newLog: Log) => {
    let doesNewLogMatchFilters = true

    if (qs.search && !newLog.content.includes(qs.search)) {
      doesNewLogMatchFilters = false
    }

    if (qs.type && newLog.type !== qs.type) {
      doesNewLogMatchFilters = false
    }

    if (qs.idHost && newLog.idHost !== qs.idHost) {
      doesNewLogMatchFilters = false
    }

    if (qs.group && newLog.group !== qs.group) {
      doesNewLogMatchFilters = false
    }

    if (
      qs.from &&
      DateTime.fromJSDate(new Date(newLog.dateLog)) < DateTime.fromJSDate(new Date(qs.from))
    ) {
      doesNewLogMatchFilters = false
    }

    if (
      qs.to &&
      DateTime.fromJSDate(new Date(newLog.dateLog)) >
        DateTime.fromJSDate(new Date(qs.to)).endOf('day')
    ) {
      doesNewLogMatchFilters = false
    }

    if (doesNewLogMatchFilters) {
      setLogsState((prevLogs) => {
        const maxLogsPerPages = qs.perPage || DEFAULT_LOGS_COUNT_PER_PAGE
        if (prevLogs.length >= maxLogsPerPages) {
          return [newLog, ...prevLogs.slice(0, maxLogsPerPages - 1)]
        }
        return [newLog, ...prevLogs]
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="">Logs en temps réel :</label>
      <Switch
        title={
          qs.order === 'asc'
            ? 'Les logs en temps réel sont désactivés car vous avez trié les logs par ordre croissant'
            : parseInt(qs.page) > 1
              ? 'Les logs en temps réel ne sont disponibles que sur la première page'
              : 'Activer/Désactiver les logs en temps réel'
        }
        onCheckedChange={(checked) => {
          if (checked) {
            // On utilise router.visit pour recharger la page et mettre à jour les logs
            router.visit('/logs', {
              data: qs,
            })
          } else {
            stopListening()
          }
        }}
        disabled={!isRealTimeAllowed}
        checked={isRealTimeActive}
        className="switch_span_white data-[state=checked]:!bg-main_color !bg-bg_tertiary outline outline-white/10"
      />
    </div>
  )
}

export default SwitchRealTime
