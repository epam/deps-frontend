
import { lazy } from 'react'
import { Localization, localize } from '@/localization/i18n'
import { sessionStorageWrapper } from '@/utils/sessionStorageWrapper'

const getStorageKey = (chunkName) => `isChunk${chunkName}RetryAttempted`

const lazyLoader = (resolver, name = 'default') => (
  lazy(async () => {
    const storageKey = getStorageKey(name)
    const isChunkRetryAttempted = JSON.parse(
      sessionStorageWrapper.getItem(storageKey),
    )

    try {
      const resolved = await resolver()
      isChunkRetryAttempted && sessionStorageWrapper.removeItem(storageKey)
      return { default: resolved[name] }
    } catch {
      if (!isChunkRetryAttempted) {
        sessionStorageWrapper.setItem(storageKey, true)
        return window.location.reload()
      }

      throw new Error(localize(Localization.LOADING_FAILED_MESSAGE))
    }
  })
)

export {
  lazyLoader as lazy,
}
