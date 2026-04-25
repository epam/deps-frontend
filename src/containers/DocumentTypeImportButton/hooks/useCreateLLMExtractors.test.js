
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { mockDocumentTypeData } from '../__mocks__/mockDocumentTypeData'
import { initialValues } from '../constants'
import { useCreateLLMExtractors } from './useCreateLLMExtractors'

jest.mock('@/utils/env', () => mockEnv)

const mockCreateLLMExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve(mockCreateLLMExtractorResponse)),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useCreateLLMExtractorMutation: jest.fn(() => ([mockCreateLLMExtractor])),
}))

const mockCreateLLMExtractorResponse = { extractorId: 'mockLLMExtractorId' }

const defaultProps = {
  documentTypeDataRef: {
    current: mockDocumentTypeData,
  },
  increaseRequestCount: jest.fn(),
  llmExtractorsIdsMappingRef: {
    current: initialValues.llmExtractorsIdsMapping,
  },
}

test('hook returns correct values', () => {
  const { result } = renderHook(() => useCreateLLMExtractors(defaultProps))

  expect(result.current).toEqual({
    createLLMExtractors: expect.any(Function),
  })
})

test('calls createLLMExtractor with correct arguments on LLMExtractors creation', async () => {
  const { result } = renderHook(() => useCreateLLMExtractors(defaultProps))
  const { createLLMExtractors } = result.current
  await createLLMExtractors()

  mockDocumentTypeData.llmExtractors.forEach((llmExtractor, index) => {
    expect(mockCreateLLMExtractor).nthCalledWith(
      index + 1,
      {
        documentTypeName: mockDocumentTypeData.name,
        extractorName: llmExtractor.name,
        provider: llmExtractor.llmReference.provider,
        model: llmExtractor.llmReference.model,
        extractionParams: llmExtractor.extractionParams,
      },
    )
  })
})

test('calls increaseRequestCount after every LLMExtractor creation', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useCreateLLMExtractors(defaultProps))
  const { createLLMExtractors } = result.current
  await createLLMExtractors()

  const expectedCallTimes = mockDocumentTypeData.llmExtractors.length
  expect(defaultProps.increaseRequestCount).toHaveBeenCalledTimes(expectedCallTimes)
})
