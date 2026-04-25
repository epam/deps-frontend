
import { useEffect } from 'react'
import { history } from '@/utils/history'
import { goBack } from '@/utils/routerActions'

/**
 * History package have an exceptional case handler for goBack() blocking case.
 * which is calling goBack by himself, but global history object batches this call.
 * So we use scheduleBack flag and history.listen to reivoke goBack method without being batched by global history
 *
 * no need to store this flag and history.listen handler when we want to block history by using goTo or goForward
 */

let scheduleBack = false

const LocationChange = ({
  onDeactivate,
}) => {
  useEffect(
    () => {
      const unlisten = history.listen(onLocation)
      const unblock = history.block(onBlock)

      function onLocation () {
        if (scheduleBack) {
          scheduleBack = false
          goBack()
        }
      }

      function onBlock () {
        onDeactivate().then((cancel) => {
          if (!cancel) {
            unblock()
            scheduleBack = true
          }
        })
        scheduleBack = false
        return false
      }

      return () => {
        unblock()
        unlisten()
      }
    },
    [onDeactivate],
  )

  return null
}

export {
  LocationChange,
}
