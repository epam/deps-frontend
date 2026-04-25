
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { DefaultPaginationConfig } from '@/models/PaginationConfig'
import { apiMap } from '@/utils/apiMap'
import {
  useFetchConversationsQuery,
  useFetchConversationQuery,
  useCreateConversationMutation,
  useDeleteConversationMutation,
  useUpdateConversationMutation,
} from './conversationApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const builder = {
        query: (config) => config.query,
        mutation: (config) => config.query,
      }

      const res = args.endpoints(builder)

      return {
        useFetchConversationsQuery: jest.fn(() => (variables) => res.fetchConversations(variables)),
        useFetchConversationQuery: jest.fn(() => (variables) => res.fetchConversation(variables)),
        useCreateConversationMutation: jest.fn(() => (variables) => res.createConversation(variables)),
        useDeleteConversationMutation: jest.fn(() => (variables) => res.deleteConversation(variables)),
        useUpdateConversationMutation: jest.fn(() => (variables) => res.updateConversation(variables)),
      }
    },
  },
}))

describe('conversationApi: useFetchConversationsQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const { result } = renderHook(() => useFetchConversationsQuery())

    await waitFor(() => {
      expect(result.current(DefaultPaginationConfig)).toEqual(
        apiMap.apiGatewayV2.v5.agenticAi.conversations(DefaultPaginationConfig),
      )
    })
  })
})

describe('conversationApi: useFetchConversationQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const conversationId = 'mockConversationId'

    const { result } = renderHook(() => useFetchConversationQuery())

    await waitFor(() => {
      expect(result.current({ conversationId })).toEqual(
        apiMap.apiGatewayV2.v5.agenticAi.conversations.conversation(conversationId),
      )
    })
  })
})

describe('conversationApi: useCreateConversationMutation', () => {
  test('calls correct endpoint with correct payload', async () => {
    const payload = {
      agentVendorId: 'vendor-id',
      modeId: 'mode-id',
      title: 'title',
    }

    const { result } = renderHook(() => useCreateConversationMutation())

    await waitFor(() => {
      expect(result.current(payload)).toEqual({
        url: apiMap.apiGatewayV2.v5.agenticAi.conversations(),
        method: RequestMethod.POST,
        body: payload,
      })
    })
  })
})

describe('conversationApi: useDeleteConversationMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const conversationId = 'mockConversationId'

    const { result } = renderHook(() => useDeleteConversationMutation())

    await waitFor(() => {
      expect(result.current(conversationId)).toEqual({
        url: apiMap.apiGatewayV2.v5.agenticAi.conversations({ id: conversationId }),
        method: RequestMethod.DELETE,
      })
    })
  })
})

describe('conversationApi: useUpdateConversationMutation', () => {
  test('calls correct endpoint with correct payload', async () => {
    const conversationId = 'mockConversationId'
    const data = {
      title: 'title',
    }

    const { result } = renderHook(() => useUpdateConversationMutation())

    await waitFor(() => {
      expect(result.current({
        conversationId,
        data,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.agenticAi.conversations.conversation(conversationId),
        method: RequestMethod.PATCH,
        body: data,
      })
    })
  })
})
