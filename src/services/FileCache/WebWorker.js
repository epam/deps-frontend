
import { ActionType } from './constants'
import { IndexedDbService } from './IndexedDbService'

const createRequest = (headers) => (url) => fetch(url, {
  headers: {
    ...headers,
  },
})

self.onmessage = async (event) => {
  const { type, payload, messageId } = event.data

  try {
    switch (type) {
      case ActionType.REQUEST_AND_STORE_IN_CACHE: {
        const { urls, requestHeaders } = payload
        const requestCallback = createRequest(requestHeaders)
        const cachedData = await IndexedDbService.requestAndStore({
          urls,
          requestCallback,
        })
        self.postMessage({
          type: ActionType.REQUEST_AND_STORE_IN_CACHE,
          payload: cachedData,
          messageId,
        })
        break
      }

      case ActionType.GET_FROM_CACHE: {
        const cachedData = await IndexedDbService.getBlob(payload)
        self.postMessage({
          type: ActionType.GET_FROM_CACHE,
          payload: cachedData,
          messageId,
        })
        break
      }

      case ActionType.STORE_IN_CACHE: {
        await IndexedDbService.saveBlob({
          url: payload.url,
          blob: payload.blob,
        })
        break
      }
    }
  } catch {
    self.postMessage({
      type,
      payload: null,
      messageId,
    })
  }
}
