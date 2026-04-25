
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { apiMap } from '@/utils/apiMap'
import { useFetchModeQuery } from './modeApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useFetchModeQuery: jest.fn(() => (args) => res.fetchMode(args)),
      }
    },
  },
}))

describe('modeApi: useFetchModeQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const code = 'mockModeCode'

    const { result } = renderHook(() => useFetchModeQuery())

    await waitFor(() => {
      expect(result.current({ code })).toEqual(
        apiMap.agenticAi.v1.modes(code),
      )
    })
  })
})
