
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFetchLLMsQuery } from '@/apiRTK/LLMsApi'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import { LLModel, LLMProvider } from '@/models/LLMProvider'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { ExtractionLLMSelect } from './ExtractionLLMSelect'

jest.mock('@/apiRTK/LLMsApi', () => ({
  useFetchLLMsQuery: jest.fn(() => ({
    data: [],
    isFetching: false,
    isError: false,
  })),
}))

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

const mockProviders = [
  new LLMProvider({
    code: 'providerCode1',
    name: 'provider1',
    models: [
      new LLModel({
        name: 'model-1-1',
        code: 'modelCode-1-1',
        description: 'description-1-1',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
      new LLModel({
        name: 'model-1-2',
        code: 'modelCode-1-2',
        description: 'description-1-2',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
    ],
  }),
  new LLMProvider({
    code: 'providerCode2',
    name: 'provider2',
    models: [
      new LLModel({
        name: 'model-2-1',
        code: 'modelCode-2-1',
        description: 'description-2-1',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
    ],
  }),
]

test('shows notification message in case of llms fetching failure', async () => {
  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: [],
    isFetching: false,
    isError: true,
  }))

  render(
    <ExtractionLLMSelect />,
  )

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(1, localize(Localization.FETCH_LLMS_FAILURE_MESSAGE))
  })
})

test('select with all providers and their models is displayed in the document', async () => {
  useFetchLLMsQuery.mockImplementationOnce(() => ({
    data: mockProviders,
    isFetching: false,
    isError: false,
  }))

  render(
    <ExtractionLLMSelect />,
  )

  const combobox = screen.getByRole('combobox')
  expect(combobox).toBeInTheDocument()

  await userEvent.click(combobox)

  mockProviders.forEach((provider) => {
    expect(screen.getAllByText(provider.name)).toHaveLength(provider.models.length)
  })

  const allModels = mockProviders.flatMap((provider) => provider.models)
  allModels.forEach((model) => {
    expect(screen.getByText(model.name)).toBeInTheDocument()
  })
})
