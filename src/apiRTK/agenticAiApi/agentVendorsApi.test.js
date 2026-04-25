
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { apiMap } from '@/utils/apiMap'
import { useFetchAgentVendorsQuery } from './agentVendorsApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
      })

      return {
        useFetchAgentVendorsQuery: jest.fn(() => () => res.fetchAgentVendors()),
      }
    },
  },
}))

describe('agentVendorsApi: useFetchAgentVendorsQuery', () => {
  test('calls correct endpoint', async () => {
    const { result } = renderHook(() => useFetchAgentVendorsQuery())

    await waitFor(() => {
      expect(result.current()).toEqual(
        apiMap.apiGatewayV2.v5.agenticAi.agentVendors(),
      )
    })
  })
})
