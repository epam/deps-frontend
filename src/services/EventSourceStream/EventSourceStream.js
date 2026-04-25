import { createEventSource } from 'eventsource-client'
import { authenticationProvider } from '@/authentication'
import { apiMap } from '@/utils/apiMap'

class EventSourceStream {
  #eventSource = null

  #consumersMap = new Map()

  #createEventSource = () => {
    this.#eventSource = createEventSource({
      url: apiMap.apiGatewayV2.v5.eventsStreaming(),
      headers: {
        Authorization: `Bearer ${authenticationProvider.getAccessToken()}`,
      },
      onMessage: this.#onMessage,
    })
  }

  #addListeners = () => {
    document.addEventListener('visibilitychange', this.#handleVisibilityChange)
  }

  #handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.#eventSource.close()
      this.#eventSource = null
    } else {
      this.#createEventSource()
    }
  }

  #onMessage = async (message) => {
    for (const consume of this.#consumersMap.values()) {
      await consume(message)
    }
  }

  init = () => {
    if (this.#eventSource) {
      return
    }

    this.#createEventSource()
    this.#addListeners()
  }

  addConsumer = (containerName, consumer) => {
    this.#consumersMap.set(containerName, consumer)
  }

  removeConsumer = (containerName) => {
    this.#consumersMap.delete(containerName)
  }
}

export const eventSourceStream = new EventSourceStream()
