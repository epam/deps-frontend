
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { RequestMethod } from '@/enums/RequestMethod'
import { apiMap } from '@/utils/apiMap'
import {
  useCreateLLMExtractorMutation,
  useUpdateLLMExtractorMutation,
  useUpdateExtractorLLMReferenceMutation,
  useCreateLLMExtractorQueryMutation,
  useMoveLLMExtractorQueryMutation,
  useUpdateLLMExtractorQueryMutation,
} from './llmExtractorApi'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/rootApi', () => ({
  rootApi: {
    injectEndpoints: (args) => {
      const res = args.endpoints({
        query: (arg) => arg.query,
        mutation: (arg) => arg.query,
      })

      return {
        useCreateLLMExtractorMutation: jest.fn(() => (args) => res.createLLMExtractor(args)),
        useUpdateLLMExtractorMutation: jest.fn(() => (args) => res.updateLLMExtractor(args)),
        useUpdateExtractorLLMReferenceMutation: jest.fn(() => (args) => res.updateExtractorLLMReference(args)),
        useCreateLLMExtractorQueryMutation: jest.fn(() => (args) => res.createLLMExtractorQuery(args)),
        useMoveLLMExtractorQueryMutation: jest.fn(() => (args) => res.moveLLMExtractorQuery(args)),
        useUpdateLLMExtractorQueryMutation: jest.fn(() => (args) => res.updateLLMExtractorQuery(args)),
      }
    },
  },
}))

describe('llmExtractorApi: useCreateLLMExtractorMutation', () => {
  test('calls correct endpoint', async () => {
    const mockData = {
      extractorName: 'TestLLM',
      documentTypeName: 'mockDocumentTypeName',
      provider: 'LLM_Provider',
      model: 'LLM_Model',
      extractionParams: {
        customInstruction: 'Test Instruction',
        groupingFactor: 6,
        temperature: 0.2,
        topP: 0.5,
      },
    }

    const { result } = renderHook(() => useCreateLLMExtractorMutation())

    await waitFor(() => {
      expect(result.current(mockData)).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.llmExtractor(),
        method: RequestMethod.POST,
        body: mockData,
      })
    })
  })
})

describe('llmExtractorApi: useUpdateLLMExtractorMutation', () => {
  test('calls correct endpoint', async () => {
    const documentTypeId = 'mockDocumentTypeId'
    const extractorId = 'mockExtractorId'
    const mockData = {
      extractorName: 'TestLLM',
      extractionParams: {
        customInstruction: 'Test Instruction',
        groupingFactor: 6,
        temperature: 0.2,
        topP: 0.5,
      },
    }

    const { result } = renderHook(() => useUpdateLLMExtractorMutation())

    const args = {
      documentTypeId,
      extractorId,
      data: mockData,
    }

    await waitFor(() => {
      expect(result.current(args)).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.extractor(
          documentTypeId,
          extractorId,
        ),
        method: RequestMethod.PUT,
        body: mockData,
      })
    })
  })
})

describe('llmExtractorApi: useUpdateExtractorLLMReferenceMutation', () => {
  test('calls correct endpoint', async () => {
    const documentTypeId = 'mockDocumentTypeId'
    const extractorId = 'mockExtractorId'
    const mockData = {
      provider: 'LLM_Provider',
      model: 'LLM_Model',
    }

    const { result } = renderHook(() => useUpdateExtractorLLMReferenceMutation())

    const args = {
      documentTypeId,
      extractorId,
      data: mockData,
    }

    await waitFor(() => {
      expect(result.current(args)).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.extractor.llm(
          documentTypeId,
          extractorId,
        ),
        method: RequestMethod.PUT,
        body: mockData,
      })
    })
  })
})

describe('llmExtractorApi: useCreateLLMExtractorQueryMutation', () => {
  test('calls correct endpoint', async () => {
    const documentTypeId = 'mockDocumentTypeId'
    const extractorId = 'mockExtractorId'
    const mockData = {
      code: 'fieldCode',
      prompt: 'Prompt Value',
      dataType: 'string',
    }

    const { result } = renderHook(() => useCreateLLMExtractorQueryMutation())

    const args = {
      documentTypeId,
      extractorId,
      data: mockData,
    }

    await waitFor(() => {
      expect(result.current(args)).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.extractor.extractionQuery(documentTypeId, extractorId),
        method: RequestMethod.POST,
        body: mockData,
      })
    })
  })
})

describe('llmExtractorApi: useMoveLLMExtractorQueryMutation', () => {
  test('calls correct endpoint', async () => {
    const documentTypeId = 'mockDocumentTypeId'
    const mockData = {
      sourceExtractorId: 'extractorId-1',
      targetExtractorId: 'extractorId-2',
      fieldsCodes: ['fieldCode'],
    }

    const { result } = renderHook(() => useMoveLLMExtractorQueryMutation())

    const args = {
      documentTypeId,
      data: mockData,
    }

    await waitFor(() => {
      expect(result.current(args)).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.moveQueries(documentTypeId),
        method: RequestMethod.POST,
        body: mockData,
      })
    })
  })
})

describe('llmExtractorApi: useUpdateLLMExtractorQueryMutation', () => {
  test('calls correct endpoint', async () => {
    const documentTypeId = 'mockDocumentTypeId'
    const extractorId = 'mockExtractorId'
    const fieldCode = 'mockFieldCode'
    const mockData = {
      prompt: 'Prompt Value',
    }

    const { result } = renderHook(() => useUpdateLLMExtractorQueryMutation())

    const args = {
      documentTypeId,
      extractorId,
      fieldCode,
      data: mockData,
    }

    await waitFor(() => {
      expect(result.current(args)).toEqual({
        url: apiMap.apiGatewayV2.v5.documentTypes.documentType.llmExtractors.extractor.extractionQuery.field(
          documentTypeId,
          extractorId,
          fieldCode,
        ),
        method: RequestMethod.PATCH,
        body: mockData,
      })
    })
  })
})
