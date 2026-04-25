
import { v4 as uuidv4 } from 'uuid'
import { authenticationProvider } from '@/authentication'
import { MimeType } from '@/enums/MimeType'
import { RequestHeader } from '@/enums/RequestHeader'
import { ActionType } from './constants'

const defaultHeaders = {
  [RequestHeader.ACCEPT]: MimeType.APPLICATION_JSON,
  [RequestHeader.CONTENT_TYPE]: MimeType.APPLICATION_JSON,
}

const getAuthHeader = () => ({
  [RequestHeader.AUTHORIZATION]: `Bearer ${authenticationProvider.getAccessToken()}`,
})

class FileWorkerCache {
  constructor (worker) {
    this.worker = worker
    this.setupMessaging()
    this.pendingResolves = []
  }

  setupMessaging = () => {
    this.worker.onmessage = (e) => {
      const toResolve = this.pendingResolves.filter((resolve) => resolve.messageId === e.data.messageId)

      toResolve.forEach((entity) => entity.resolve(e.data.payload))

      this.pendingResolves = this.pendingResolves.filter((entity) => !toResolve.includes(entity))
    }
  }

  store = (key, value) => this.worker.postMessage({
    type: ActionType.STORE_IN_CACHE,
    payload: {
      url: key,
      blob: value,
    },
  })

  requestAndStore = (urls) => (
    new Promise((resolve) => {
      const messageId = uuidv4()

      this.pendingResolves.push({
        messageId,
        resolve,
      })

      this.worker.postMessage({
        type: ActionType.REQUEST_AND_STORE_IN_CACHE,
        payload: {
          requestHeaders: {
            ...defaultHeaders,
            ...getAuthHeader(),
          },
          urls,
        },
        messageId,
      })
    })
  )

  get = (url) => (
    new Promise((resolve) => {
      const messageId = uuidv4()

      this.pendingResolves.push({
        messageId,
        resolve,
      })

      this.worker.postMessage({
        type: ActionType.GET_FROM_CACHE,
        payload: url,
        messageId,
      })
    })
  )
}

export {
  FileWorkerCache,
}
