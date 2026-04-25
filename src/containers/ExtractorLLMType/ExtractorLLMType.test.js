
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import { useFetchLLMsQuery } from '@/apiRTK/LLMsApi'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import { LLMReference } from '@/models/LLMExtractor'
import { LLModel, LLMProvider } from '@/models/LLMProvider'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { ExtractorLLMType } from './ExtractorLLMType'

jest.mock('@/apiRTK/LLMsApi', () => ({
  useFetchLLMsQuery: jest.fn(() => ({
    data: [],
    isFetching: false,
    isError: false,
  })),
}))

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

const mockProvider = new LLMProvider({
  code: 'providerCode',
  name: 'Provider Name',
  models: [
    new LLModel({
      name: 'Model Name 1',
      code: 'modelCode1',
      contextType: LLMModelContextType.TEXT_BASED,
    }),
    new LLModel({
      name: 'Model Name 2',
      code: 'modelCode2',
      contextType: LLMModelContextType.TEXT_BASED,
    }),
  ],
})

const mockLLMReference = new LLMReference({
  model: mockProvider.models[0].code,
  provider: mockProvider.code,
})

test('shows spinner when LLMs are fetching', async () => {
  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [],
    isFetching: true,
    isError: false,
  }))

  render(
    <ExtractorLLMType
      llmReference={mockLLMReference}
      render={jest.fn()}
    />,
  )

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows correct message when LLMs fetching failed', async () => {
  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [],
    isFetching: false,
    isError: true,
  }))

  render(
    <ExtractorLLMType
      llmReference={mockLLMReference}
      render={jest.fn()}
    />,
  )

  expect(notifyWarning).nthCalledWith(1, localize(Localization.FETCH_LLMS_FAILURE_MESSAGE))
})

test('shows provider and model name in correct format', async () => {
  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [mockProvider],
    isFetching: false,
    isError: false,
  }))

  const mockRender = jest.fn((name) => name)

  const expectedDisplayedName = `${mockProvider.name} | ${mockProvider.models[0].name}`

  render(
    <ExtractorLLMType
      llmReference={mockLLMReference}
      render={mockRender}
    />,
  )

  expect(mockRender).nthCalledWith(1, expectedDisplayedName)
})
