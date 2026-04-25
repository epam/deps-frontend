
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks/dom'
import { eventSourceStream } from '@/services/EventSourceStream'
import { ENV } from '@/utils/env'
import { jsonTryParse } from '@/utils/jsonTryParse'
import { KnownBusinessEvent } from './KnownBusinessEvent'
import { useEventSource } from './useEventSource'

var mockOnMessage

const mockHandlersMap = {
  data: {},
  get: jest.fn((key) => mockHandlersMap.data[key]),
  set: jest.fn((key, value) => {
    mockHandlersMap.data[key] = value
  }),
  clear: jest.fn(() => {
    mockHandlersMap.data = {}
  }),
}

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(() => ({
    current: mockHandlersMap,
  })),
}))

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/services/EventSourceStream', () => ({
  eventSourceStream: {
    addConsumer: jest.fn((containerName, onMessage) => {
      mockOnMessage = onMessage
    }),
    removeConsumer: jest.fn(),
    init: jest.fn(),
  },
}))

const containerName = 'testContainer'

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns addEvent callback as a result of the hook call', () => {
  const { result } = renderHook(() => useEventSource(containerName))

  expect(result.current).toEqual(expect.any(Function))
})

test('calls eventSourceStream.addConsumer when hook is mounted', () => {
  renderHook(() => useEventSource(containerName))

  expect(eventSourceStream.addConsumer).nthCalledWith(
    1,
    containerName,
    expect.any(Function),
  )
})

test('calls eventSourceStream.removeConsumer and clear stack of the handlers when hook is unmounted', () => {
  const { unmount } = renderHook(() => useEventSource(containerName))

  unmount()

  expect(eventSourceStream.removeConsumer).nthCalledWith(
    1,
    containerName,
  )
  expect(mockHandlersMap.clear).toHaveBeenCalled()
})

test('raises an error when calling addEvent in case environment feature flag is disabled', () => {
  ENV.FEATURE_SERVER_SENT_EVENTS = false

  const { result } = renderHook(() => useEventSource(containerName))

  expect(() => result.current(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, () => {})).toThrowError(
    'Server Sent Events feature is not enabled',
  )

  ENV.FEATURE_SERVER_SENT_EVENTS = true
})

test('adds callback to the stack of handlers when calling addEvent in case event is known', () => {
  const { result } = renderHook(() => useEventSource(containerName))

  const testCb = jest.fn()

  result.current(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, testCb)

  expect(mockHandlersMap.set).toHaveBeenCalledWith(
    KnownBusinessEvent.DOCUMENT_STATE_UPDATED,
    testCb,
  )
})

test('not adds callback to the stack of handlers when calling addEvent in case event is unknown', () => {
  const { result } = renderHook(() => useEventSource(containerName))

  const testCb = jest.fn()

  result.current('unknownEvent', testCb)

  expect(mockHandlersMap.set).not.toHaveBeenCalled()
})

test('calls registered handler with correct event data when known event appeared', () => {
  const { result } = renderHook(() => useEventSource(containerName))

  const testCb = jest.fn((data) => data)

  result.current(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, testCb)

  const mockEvent = {
    event: KnownBusinessEvent.DOCUMENT_STATE_UPDATED,
    data: JSON.stringify({ test: 'test' }),
  }

  mockOnMessage(mockEvent)

  expect(testCb).nthCalledWith(1, jsonTryParse(mockEvent.data))
})

test('not calls registered handler when unknown event appeared', () => {
  const { result } = renderHook(() => useEventSource(containerName))

  const testCb = jest.fn((data) => data)

  result.current(KnownBusinessEvent.DOCUMENT_STATE_UPDATED, testCb)

  const mockEvent = {
    event: 'unknownEvent',
    data: JSON.stringify({ test: 'test' }),
  }

  mockOnMessage(mockEvent)

  expect(testCb).not.toHaveBeenCalled()
})

test('not calls eventSourceStream.addConsumer in case environment feature flag is disabled', () => {
  ENV.FEATURE_SERVER_SENT_EVENTS = false

  renderHook(() => useEventSource(containerName))

  expect(eventSourceStream.addConsumer).not.toHaveBeenCalled()
  ENV.FEATURE_SERVER_SENT_EVENTS = true
})

test('not calls eventSourceStream.removeConsumer at unmounting in case environment feature flag is disabled', () => {
  ENV.FEATURE_SERVER_SENT_EVENTS = false

  const { unmount } = renderHook(() => useEventSource(containerName))

  unmount()

  expect(eventSourceStream.removeConsumer).not.toHaveBeenCalled()
  ENV.FEATURE_SERVER_SENT_EVENTS = true
})
