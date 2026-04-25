
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useCreateAzureExtractorMutation,
  useValidateAzureExtractorCredentialsMutation,
  useFetchAzureExtractorQuery,
  useUpdateAzureExtractorMutation,
  useCheckAzureExtractorQuery,
  useSynchronizeAzureExtractorMutation,
} from './azureExtractorApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useCreateAzureExtractorMutation: jest.fn((args) => res.createAzureExtractor(args)),
        useValidateAzureExtractorCredentialsMutation: jest.fn((args) => res.validateAzureExtractorCredentials(args)),
        useFetchAzureExtractorQuery: jest.fn((args) => res.fetchAzureExtractor(args)),
        useUpdateAzureExtractorMutation: jest.fn((args) => res.updateAzureExtractor(args)),
        useCheckAzureExtractorQuery: jest.fn((args) => res.checkAzureExtractor(args)),
        useSynchronizeAzureExtractorMutation: jest.fn((args) => res.synchronizeAzureExtractor(args)),
      }
    },
  },
}))

describe('documentTypeApi: useCreateAzureExtractorMutation', () => {
  test('calls correct endpoint', async () => {
    const mockAzureData = {
      name: 'Test azure doc type',
      modelId: 'testId',
      endpoint: 'test@url.com',
      apiKey: 'testKey',
    }

    const { result } = renderHook(() => useCreateAzureExtractorMutation(mockAzureData))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.azureExtractor(),
        method: RequestMethod.POST,
        body: mockAzureData,
      })
    })
  })
})

describe('documentTypeApi: useValidateAzureExtractorCredentialsMutation', () => {
  test('calls correct endpoint', async () => {
    const mockAzureData = {
      modelId: 'testId',
      endpoint: 'test@url.com',
      apiKey: 'testKey',
    }

    const { result } = renderHook(() => useValidateAzureExtractorCredentialsMutation(mockAzureData))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.validateCredentials(),
        method: RequestMethod.POST,
        body: mockAzureData,
      })
    })
  })
})

describe('documentTypeApi: useFetchAzureExtractorQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const mockDocumentTypeId = 'id'

    const { result } = renderHook(() => useFetchAzureExtractorQuery(mockDocumentTypeId))

    await waitFor(() => {
      expect(result.current).toEqual(
        apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.extractor(mockDocumentTypeId),
      )
    })
  })
})

describe('documentTypeApi: useUpdateAzureExtractorMutation', () => {
  test('calls correct endpoint', async () => {
    const mockDocumentTypeId = 'id'

    const mockAzureData = {
      modelId: 'testId',
      endpoint: 'test@url.com',
      apiKey: 'testKey',
    }

    const { result } = renderHook(() => useUpdateAzureExtractorMutation({
      documentTypeId: mockDocumentTypeId,
      credentials: mockAzureData,
    }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.extractor(mockDocumentTypeId),
        method: RequestMethod.PUT,
        body: mockAzureData,
      })
    })
  })
})

describe('documentTypeApi: useCheckAzureExtractorQuery', () => {
  test('calls correct endpoint with correct args', async () => {
    const mockDocumentTypeId = 'id'

    const { result } = renderHook(() => useCheckAzureExtractorQuery(mockDocumentTypeId))

    await waitFor(() => {
      expect(result.current).toEqual(
        apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.extractor.checkup(mockDocumentTypeId),
      )
    })
  })
})

describe('documentTypeApi: useSynchronizeAzureExtractorMutation', () => {
  test('calls correct endpoint', async () => {
    const mockDocumentTypeId = 'id'

    const { result } = renderHook(() => useSynchronizeAzureExtractorMutation({ documentTypeId: mockDocumentTypeId }))

    await waitFor(() => {
      expect(result.current).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.azureExtractor.extractor.synchronize(mockDocumentTypeId),
        method: RequestMethod.PUT,
      })
    })
  })
})
