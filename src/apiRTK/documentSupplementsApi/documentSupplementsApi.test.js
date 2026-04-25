
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useFetchSupplementsQuery,
  useCreateOrUpdateSupplementsMutation,
} from './documentSupplementsApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useFetchSupplementsQuery: jest.fn((args) => res.fetchSupplements(args)),
        useCreateOrUpdateSupplementsMutation: jest.fn((args) => res.createOrUpdateSupplements(args)),
      }
    },
  },
}))

describe('documentSupplementsApi: useFetchSupplementsQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const documentId = 'mockId'

    const { result } = renderHook(() => useFetchSupplementsQuery(documentId))

    await waitFor(() => {
      expect(result.current).toEqual(
        apiMap.apiGatewayV2.v5.documents.document.supplement(documentId),
      )
    })
  })
})

describe('documentSupplementsApi: useCreateOrUpdateSupplementsMutation', () => {
  test('calls correct endpoint', async () => {
    const mockDocumentId = 'mockId'
    const mockDocumentTypeId = 'mockDocumentTypeId'
    const mockData = [{
      name: 'mockName',
      value: 'mockValue',
    }]

    const { result } = renderHook(() => useCreateOrUpdateSupplementsMutation(
      {
        documentId: mockDocumentId,
        documentTypeId: mockDocumentTypeId,
        data: mockData,
      }),
    )

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documents.document.supplement(mockDocumentId),
        method: RequestMethod.PUT,
        body: {
          documentTypeId: mockDocumentTypeId,
          data: mockData,
        },
      })
    })
  })
})
