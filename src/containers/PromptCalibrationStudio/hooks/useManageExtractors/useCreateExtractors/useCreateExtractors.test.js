
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { renderHook } from '@testing-library/react-hooks'
import { sendBatchRequests } from '@/containers/PromptCalibrationStudio/utils'
import { Extractor } from '@/containers/PromptCalibrationStudio/viewModels'
import { useCreateExtractors } from './useCreateExtractors'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/containers/PromptCalibrationStudio/utils', () => ({
  sendBatchRequests: jest.fn(async (requests) => {
    for (const request of requests) {
      await request()
    }
  }),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useCreateLLMExtractorMutation: jest.fn(() => [
    mockCreateLLMExtractor,
  ]),
}))

const mockUnwrap = jest.fn(() => Promise.resolve({ extractorId: 'created-extractor-1' }))
const mockCreateLLMExtractor = jest.fn(() => ({
  unwrap: mockUnwrap,
}))

const mockDocumentTypeName = 'Test Document Type'
const mockExtractors = [
  new Extractor({
    id: 'extractor-1',
    name: 'Test Extractor 1',
    model: 'openai/gpt-4',
    temperature: 0.7,
    topP: 0.9,
    groupingFactor: 1,
    customInstruction: 'Test instructions',
    pageSpan: 5,
  }),
  new Extractor({
    id: 'extractor-2',
    name: 'Test Extractor 2',
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    topP: 0.8,
    groupingFactor: 2,
    customInstruction: null,
    pageSpan: null,
  }),
]

test('creates LLM extractors and returns extractor ID mapping', async () => {
  jest.clearAllMocks()

  mockUnwrap
    .mockResolvedValueOnce({ extractorId: 'created-extractor-1' })
    .mockResolvedValueOnce({ extractorId: 'created-extractor-2' })

  const { result } = renderHook(() => useCreateExtractors())

  const extractorIdMapping = await result.current.createExtractors(
    mockDocumentTypeName,
    mockExtractors,
  )

  expect(extractorIdMapping).toEqual({
    [mockExtractors[0].id]: 'created-extractor-1',
    [mockExtractors[1].id]: 'created-extractor-2',
  })
})

test('calls sendBatchRequests when call createExtractors', async () => {
  jest.clearAllMocks()

  const { result } = renderHook(() => useCreateExtractors())

  await result.current.createExtractors(mockDocumentTypeName, mockExtractors)

  expect(sendBatchRequests).toHaveBeenCalledTimes(1)
  const [[requests, batchSize]] = sendBatchRequests.mock.calls
  expect(requests).toHaveLength(mockExtractors.length)
  expect(batchSize).toBe(3)
})
