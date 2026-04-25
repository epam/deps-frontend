
import { createEventSource } from 'eventsource-client'
import { authenticationProvider } from '@/authentication'

const getHeaders = () => ({
  Authorization: `Bearer ${authenticationProvider.getAccessToken()}`,
  Accept: 'text/event-stream',
})

const getFetchFn = (onError) => async (url, options) => {
  const response = await fetch(url, options)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error = new Error(errorData.message || 'Request failed')
    error.code = errorData.code
    onError?.(error)
    throw error
  }

  return response
}

const getOnMessageCb = (onMessage) => ({ data }) => {
  onMessage?.(data)
}

const createAuthenticatedEventSource = ({
  url,
  onMessage,
  onError,
  method,
  headers = {},
}) => {
  return createEventSource({
    url,
    method,
    headers: {
      ...getHeaders(),
      ...headers,
    },
    fetch: getFetchFn(onError),
    onMessage: getOnMessageCb(onMessage),
  })
}

export {
  createAuthenticatedEventSource,
}
