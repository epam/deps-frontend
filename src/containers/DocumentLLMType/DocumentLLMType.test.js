
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import { useFetchLLMsQuery } from '@/apiRTK/LLMsApi'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import {
  LLModel,
  LLMProvider,
  LLMSettings,
} from '@/models/LLMProvider'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DocumentLLMType } from './DocumentLLMType'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/LLMsApi', () => ({
  useFetchLLMsQuery: jest.fn(() => ({
    data: [],
    isFetching: false,
    isError: false,
  })),
}))

const mockProviderCode = 'providerCode'
const mockModelCode = 'modelCode1'
const mockModelName = 'Model1'

const mockProvider = new LLMProvider({
  code: mockProviderCode,
  name: 'Provider',
  models: [
    new LLModel({
      name: mockModelName,
      code: mockModelCode,
      description: 'description1',
      contextType: LLMModelContextType.TEXT_BASED,
    }),
    new LLModel({
      name: 'Model2',
      code: 'modelCode2',
      description: 'description2',
      contextType: LLMModelContextType.TEXT_BASED,
    }),
  ],
})

test('shows spinner when LLMs are fetching', async () => {
  const mockLLMType = LLMSettings.settingsToLLMType(mockProviderCode, mockModelCode)

  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [],
    isFetching: true,
    isError: false,
  }))

  render(<DocumentLLMType llmType={mockLLMType} />)

  await waitFor(() => {
    expect(screen.getByTestId('spin')).toBeInTheDocument()
  })
})

test('shows notification message when LLMs fetching failure', async () => {
  const mockLLMType = LLMSettings.settingsToLLMType(mockProviderCode, mockModelCode)

  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [],
    isFetching: false,
    isError: true,
  }))

  render(<DocumentLLMType llmType={mockLLMType} />)

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(1, localize(Localization.FETCH_LLMS_FAILURE_MESSAGE))
  })
})

test('shows LLM Type in specified format if document has correct LLM type', async () => {
  const mockLLMType = LLMSettings.settingsToLLMType(mockProviderCode, mockModelCode)

  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [mockProvider],
    isFetching: false,
    isError: false,
  }))

  const { container } = render(<DocumentLLMType llmType={mockLLMType} />)

  const expectedText = `${mockProvider.name} | ${mockModelName}`

  expect(container).toHaveTextContent(expectedText)
})

test('shows empty LLM Type if document has correct LLM type and model does not present in providers list', async () => {
  const mockLLMType = LLMSettings.settingsToLLMType(mockProviderCode, 'notExistingModelCode')

  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [mockProvider],
    isFetching: false,
    isError: false,
  }))

  const { container } = render(<DocumentLLMType llmType={mockLLMType} />)

  expect(container).toBeEmptyDOMElement()
})

test('shows empty LLM Type if document has correct LLM type and provider does not present in providers list', async () => {
  const mockLLMType = LLMSettings.settingsToLLMType('notExistingProviderCode', mockModelCode)

  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [mockProvider],
    isFetching: false,
    isError: false,
  }))

  const { container } = render(<DocumentLLMType llmType={mockLLMType} />)

  expect(container).toBeEmptyDOMElement()
})

test('shows LLM name if document has only model as LLM type', async () => {
  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [mockProvider],
    isFetching: false,
    isError: false,
  }))

  const { container } = render(<DocumentLLMType llmType={mockModelCode} />)

  expect(container).toHaveTextContent(mockModelName)
})

test('shows nothing if document has only model as LLM type and it does not present in providers list', async () => {
  const mockLLMType = 'notExistingModelCode'

  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [mockProvider],
    isFetching: false,
    isError: false,
  }))

  const { container } = render(<DocumentLLMType llmType={mockLLMType} />)

  expect(container).toHaveTextContent('')
})
