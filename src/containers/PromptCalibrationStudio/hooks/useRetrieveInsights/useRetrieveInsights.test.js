
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useParams } from 'react-router'
import { useRetrieveInsightsMutation } from '@/apiRTK/LLMsApi'
import { useRetrieveInsights } from './useRetrieveInsights'

jest.mock('@/utils/env', () => mockEnv)

const mockRetrieveInsights = jest.fn(() => Promise.resolve({ data: {} }))

jest.mock('@/apiRTK/LLMsApi', () => ({
  useRetrieveInsightsMutation: jest.fn(() => [
    mockRetrieveInsights,
    { isLoading: false },
  ]),
}))

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({})),
}))

const mockDocumentId = 'doc-123'
const mockFileId = 'file-456'

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns retrieveInsights function and isLoading state', () => {
  const { result } = renderHook(() => useRetrieveInsights())

  expect(result.current[0]).toBeInstanceOf(Function)
  expect(result.current[1]).toBe(false)
})

test('calls retrieveDocumentInsights with correct params when documentId is present', () => {
  useParams.mockReturnValueOnce({ documentId: mockDocumentId })

  const { result } = renderHook(() => useRetrieveInsights())

  const params = {
    model: 'gpt-4',
    customInstructions: 'Extract data',
    requestedInsights: {},
    params: { temperature: 0.5 },
  }

  result.current[0](params)

  expect(mockRetrieveInsights).toHaveBeenCalledWith({
    id: mockDocumentId,
    ...params,
  })
})

test('calls retrieveDocumentInsights with correct params when fileId is present', () => {
  useParams.mockReturnValueOnce({ fileId: mockFileId })

  const { result } = renderHook(() => useRetrieveInsights())

  const params = {
    model: 'gpt-4',
    customInstructions: 'Extract data',
    requestedInsights: {},
    params: { temperature: 0.5 },
  }

  result.current[0](params)

  expect(mockRetrieveInsights).toHaveBeenCalledWith({
    id: mockFileId,
    ...params,
  })
})

test('returns true for isLoading when retrieveDocumentInsights is loading', () => {
  useParams.mockReturnValueOnce({ documentId: mockDocumentId })

  useRetrieveInsightsMutation.mockReturnValueOnce([
    mockRetrieveInsights,
    { isLoading: true },
  ])

  const { result } = renderHook(() => useRetrieveInsights())

  expect(result.current[1]).toBe(true)
})
