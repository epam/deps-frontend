
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { useUpdateWorkflowConfigurationMutation } from './workflowConfigurationApi'

jest.mock('@/utils/env', () => mockEnv)

const mockUpdateWorkflowConfiguration = jest.fn()

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const endpoints = args.endpoints({
        mutation: (config) => ({ ...config }),
      })

      return {
        endpoints,
        useUpdateWorkflowConfigurationMutation: () => [mockUpdateWorkflowConfiguration, { isLoading: false }],
      }
    },
  },
}))

describe('workflowConfigurationApi: useUpdateWorkflowConfigurationMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const documentTypeId = 'mockDocumentTypeId'
    const data = 'mockData'

    const { result } = renderHook(() => useUpdateWorkflowConfigurationMutation())

    await waitFor(() => {
      const [trigger] = result.current
      trigger({
        documentTypeId,
        data,
      })
      expect(mockUpdateWorkflowConfiguration).toHaveBeenCalledWith({
        documentTypeId,
        data,
      })
    })
  })
})
