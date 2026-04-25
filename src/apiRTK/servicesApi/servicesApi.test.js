
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { apiMap } from '@/utils/apiMap'
import { useFetchServicesQuery } from './servicesApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
      })

      return {
        useFetchServicesQuery: jest.fn((args) => res.fetchServices(args)),
      }
    },
  },
}))

test('useFetchServicesQuery works correctly', async () => {
  const { result } = renderHook(() => useFetchServicesQuery())

  await waitFor(() => {
    expect(result.current).toEqual(apiMap.apiGatewayV2.v5.services())
  })
})
