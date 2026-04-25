
import { useCallback, useEffect, useRef } from 'react'
import { eventSourceStream } from '@/services/EventSourceStream'
import { ENV } from '@/utils/env'
import { jsonTryParse } from '@/utils/jsonTryParse'
import { KnownBusinessEvent } from './KnownBusinessEvent'

const isValid = (eventName) => (
  Object.values(KnownBusinessEvent).includes(eventName)
)

ENV.FEATURE_SERVER_SENT_EVENTS && eventSourceStream.init()

export const useEventSource = (containerName) => {
  const eventHandlersMap = useRef(new Map())

  const addEvent = useCallback((eventName, callback) => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      throw new Error('Server Sent Events feature is not enabled')
    }

    if (!isValid(eventName)) {
      return
    }

    eventHandlersMap.current.set(eventName, callback)
  }, [])

  const onMessage = useCallback(({ event, data }) => {
    if (!isValid(event)) {
      return
    }

    const handler = eventHandlersMap.current.get(event)

    if (!handler) {
      return
    }

    const jsonData = jsonTryParse(data)
    handler(jsonData)
  }, [])

  useEffect(() => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    eventSourceStream.addConsumer(containerName, onMessage)
  }, [containerName, onMessage])

  useEffect(() => () => {
    if (!ENV.FEATURE_SERVER_SENT_EVENTS) {
      return
    }
    eventHandlersMap.current.clear()
    eventSourceStream.removeConsumer(containerName)
  }, [containerName])

  return addEvent
}
