
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useDeleteDocumentTypeMutation,
  useDeleteDocumentTypeExtractorMutation,
} from './documentTypeApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useDeleteDocumentTypeMutation: jest.fn(() => (args) => res.deleteDocumentType(args)),
        useDeleteDocumentTypeExtractorMutation: jest.fn(() => (args) => res.deleteDocumentTypeExtractor(args)),
      }
    },
  },
}))

describe('documentTypeApi: useDeleteDocumentTypeMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const id = 'mockId'

    const { result } = renderHook(() => useDeleteDocumentTypeMutation())

    await waitFor(() => {
      expect(result.current(id)).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType(id),
        method: RequestMethod.DELETE,
      })
    })
  })
})

describe('documentTypeApi: useDeleteDocumentTypeExtractorMutation', () => {
  test('calls correct endpoint with correct args', async () => {
    const documentTypeId = 'mockDocumentTypeId'
    const extractorId = 'mockExtractorId'

    const { result } = renderHook(() => useDeleteDocumentTypeExtractorMutation())

    await waitFor(() => {
      expect(result.current({
        documentTypeId,
        extractorId,
      })).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.extractors.extractor(
          documentTypeId,
          extractorId,
        ),
        method: RequestMethod.DELETE,
      })
    })
  })
})
