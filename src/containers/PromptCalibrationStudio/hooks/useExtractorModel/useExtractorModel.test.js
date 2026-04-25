
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useFetchLLMsQuery } from '@/apiRTK/LLMsApi'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { LLModel, LLMProvider } from '@/models/LLMProvider'
import { useExtractorModel } from './useExtractorModel'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/apiRTK/LLMsApi', () => ({
  useFetchLLMsQuery: jest.fn(),
}))

const mockLLMsData = [
  new LLMProvider({
    code: 'openai',
    name: 'OpenAI',
    models: [
      new LLModel({
        code: 'gpt-4',
        name: 'GPT-4',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
    ],
  }),
  new LLMProvider({
    code: 'anthropic',
    name: 'Anthropic',
    models: [
      new LLModel({
        code: 'claude-3',
        name: 'Claude 3',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
    ],
  }),
]

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns provider and model names when found in data', () => {
  useFetchLLMsQuery.mockReturnValue({
    data: mockLLMsData,
    isFetching: false,
  })

  const { result } = renderHook(() => useExtractorModel('openai@gpt-4'))

  expect(result.current).toEqual({
    providerName: 'OpenAI',
    modelName: 'GPT-4',
    isFetching: false,
  })
})

test('returns original codes as fallback when provider and model are not found', () => {
  useFetchLLMsQuery.mockReturnValue({
    data: mockLLMsData,
    isFetching: false,
  })

  const { result } = renderHook(() => useExtractorModel('unknown-provider@unknown-model'))

  expect(result.current).toEqual({
    providerName: 'unknown-provider',
    modelName: 'unknown-model',
    isFetching: false,
  })
})
