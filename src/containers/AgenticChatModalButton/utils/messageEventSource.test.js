
import { mockEnv } from '@/mocks/mockEnv'
import { createEventSource } from 'eventsource-client'
import { RequestMethod } from '@/enums/RequestMethod'
import { createAuthenticatedEventSource } from './messageEventSource'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('eventsource-client')

jest.mock('@/authentication', () => ({
  authenticationProvider: {
    getAccessToken: jest.fn(() => mockedAccessToken),
  },
}))

const mockedAccessToken = 'mockedAccessToken'

const props = {
  url: 'mockUrl',
  method: RequestMethod.PATCH,
  onMessage: jest.fn(),
  onError: jest.fn(),
}

const headers = {
  Authorization: `Bearer ${mockedAccessToken}`,
  Accept: 'text/event-stream',
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('calls createEventSource with correct params', () => {
  createAuthenticatedEventSource(props)

  expect(createEventSource).nthCalledWith(1, {
    url: props.url,
    headers,
    method: props.method,
    fetch: expect.any(Function),
    onMessage: expect.any(Function),
  })
})

test('calls onMessage on fetching success', async () => {
  const message = 'Test message'

  createAuthenticatedEventSource(props)
  const { onMessage: eventSourceOnMessage } = createEventSource.mock.calls[0][0]
  eventSourceOnMessage({ data: message })

  expect(props.onMessage).nthCalledWith(1, message)
})

test('should throw error and call onError if fetching fails', async () => {
  const errorData = {
    message: 'Bad request',
    code: 'error_code',
  }
  // eslint-disable-next-line no-undef
  jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
    ok: false,
    json: jest.fn().mockResolvedValue(errorData),
  })

  createAuthenticatedEventSource(props)
  const { fetch: fetchFn } = createEventSource.mock.calls[0][0]

  await expect(fetchFn(props.url)).rejects.toThrow(errorData.message)

  expect(props.onError).toHaveBeenCalledWith(expect.objectContaining({
    message: errorData.message,
    code: errorData.code,
  }))
})
