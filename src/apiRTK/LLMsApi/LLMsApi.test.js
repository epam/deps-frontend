/* eslint-disable no-undef */

import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useFetchLLMsQuery,
  useRetrieveInsightsMutation,
} from './LLMsApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useFetchLLMsQuery: jest.fn(() => (args) => res.fetchLLMs(args)),
        useRetrieveInsightsMutation: jest.fn(() => (args) => res.retrieveInsights(args)),
      }
    },
  },
}))

describe('LLMsApi: useFetchLLMsQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const id = 'mockId'

    const { result } = renderHook(() => useFetchLLMsQuery())

    await waitFor(() => {
      expect(result.current(id)).toEqual(
        apiMap.apiGatewayV2.v5.tools.llms(id),
      )
    })
  })
})

describe('LLMsApi: useRetrieveInsightsMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const mockData = {
      id: 'documentId',
      data: 'data',
    }

    const { result } = renderHook(() => useRetrieveInsightsMutation())

    await waitFor(() => {
      expect(result.current(mockData)).toEqual(
        {
          method: RequestMethod.POST,
          url: apiMap.apiGatewayV2.v5.documents.document.analysis.retrieveInsights(mockData.id),
          body: {
            data: mockData.data,
          },
        },
      )
    })
  })
})
