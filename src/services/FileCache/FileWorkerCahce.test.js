
import { mockEnv } from '@/mocks/mockEnv'
import { MimeType } from '@/enums/MimeType'
import { RequestHeader } from '@/enums/RequestHeader'
import { ActionType } from './constants'
import { FileWorkerCache } from './FileWorkerCache'

const mockToken = 'token'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/authentication', () => ({
  authenticationProvider: {
    getAccessToken: jest.fn(() => mockToken),
  },
}))

const mockWorker = {
  postMessage: jest.fn(),
  onmessage: jest.fn(),
}

test('calls postMessage worker method with correct args when call store instance method', () => {
  const key = 'test-url'
  const value = new Blob()
  const instance = new FileWorkerCache(mockWorker)
  instance.store(key, value)

  expect(mockWorker.postMessage).toHaveBeenCalledWith({
    type: ActionType.STORE_IN_CACHE,
    payload: {
      url: key,
      blob: value,
    },
  })
})

test('calls postMessage worker method with correct args when call requestAndStore instance method', () => {
  jest.clearAllMocks()

  const urls = ['one']
  const instance = new FileWorkerCache(mockWorker)
  instance.requestAndStore(urls)

  expect(mockWorker.postMessage).toHaveBeenCalledWith({
    type: ActionType.REQUEST_AND_STORE_IN_CACHE,
    payload: {
      requestHeaders: {
        [RequestHeader.ACCEPT]: MimeType.APPLICATION_JSON,
        [RequestHeader.CONTENT_TYPE]: MimeType.APPLICATION_JSON,
        [RequestHeader.AUTHORIZATION]: `Bearer ${mockToken}`,
      },
      urls,
    },
    messageId: expect.any(String),
  })
})

test('calls postMessage worker method with correct args when call get instance method', () => {
  jest.clearAllMocks()

  const url = 'one'
  const instance = new FileWorkerCache(mockWorker)
  instance.get(url)

  expect(mockWorker.postMessage).toHaveBeenCalledWith({
    type: ActionType.GET_FROM_CACHE,
    payload: url,
    messageId: expect.any(String),
  })
})

test('resolves pending promise when worker sends message with matching messageId', async () => {
  jest.clearAllMocks()

  const mockPayload = { data: 'test-data' }
  const instance = new FileWorkerCache(mockWorker)

  const promise = instance.get('test-url')

  const callArgs = mockWorker.postMessage.mock.calls[0][0]
  const messageId = callArgs.messageId

  mockWorker.onmessage({
    data: {
      messageId,
      payload: mockPayload,
    },
  })

  const result = await promise
  expect(result).toEqual(mockPayload)
})

test('resolves multiple pending promises with correct payloads', async () => {
  jest.clearAllMocks()

  const mockPayload1 = { data: 'test-data-1' }
  const mockPayload2 = { data: 'test-data-2' }
  const instance = new FileWorkerCache(mockWorker)

  const promise1 = instance.get('test-url-1')
  const promise2 = instance.get('test-url-2')

  const messageId1 = mockWorker.postMessage.mock.calls[0][0].messageId
  const messageId2 = mockWorker.postMessage.mock.calls[1][0].messageId

  mockWorker.onmessage({
    data: {
      messageId: messageId1,
      payload: mockPayload1,
    },
  })
  mockWorker.onmessage({
    data: {
      messageId: messageId2,
      payload: mockPayload2,
    },
  })

  const result1 = await promise1
  const result2 = await promise2

  expect(result1).toEqual(mockPayload1)
  expect(result2).toEqual(mockPayload2)
})

test('removes resolved promises from pendingResolves array', async () => {
  jest.clearAllMocks()

  const mockPayload = { data: 'test-data' }
  const instance = new FileWorkerCache(mockWorker)

  instance.get('test-url')

  expect(instance.pendingResolves.length).toBe(1)

  const messageId = mockWorker.postMessage.mock.calls[0][0].messageId
  mockWorker.onmessage({
    data: {
      messageId,
      payload: mockPayload,
    },
  })

  expect(instance.pendingResolves.length).toBe(0)
})
