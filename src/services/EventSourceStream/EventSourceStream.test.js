
import { mockEnv } from '@/mocks/mockEnv'
import { createEventSource } from 'eventsource-client'
import { apiMap } from '@/utils/apiMap'
import { eventSourceStream } from './EventSourceStream'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('eventsource-client', () => ({
  createEventSource: jest.fn(() => ({
    close: jest.fn(),
  })),
}))

jest.mock('@/authentication', () => ({
  authenticationProvider: {
    getAccessToken: jest.fn(() => 'mockedAccessToken'),
  },
}))

test('provides api to manage event source', () => {
  expect(eventSourceStream).toHaveProperty('addConsumer')
  expect(eventSourceStream).toHaveProperty('removeConsumer')
  expect(eventSourceStream).toHaveProperty('init')
})

test('calls createEventSource with correct parameters when init is executed', () => {
  eventSourceStream.init()
  expect(createEventSource).nthCalledWith(1,
    {
      url: apiMap.apiGatewayV2.v5.eventsStreaming(),
      headers: {
        Authorization: 'Bearer mockedAccessToken',
      },
      onMessage: expect.any(Function),
    })
})
