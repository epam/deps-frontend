
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
import { useChatSettings } from '../hooks'
import { LLMSettingsButton } from './LLMSettingsButton'

jest.mock('@/apiRTK/LLMsApi', () => ({
  useFetchLLMsQuery: jest.fn(() => ({
    providers: mockProviders,
    isFetching: false,
    isError: false,
  })),
}))

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('../SettingsButton', () => ({
  SettingsButton: ({ onClick, title }) => (
    <button
      data-testid='settings-button'
      onClick={onClick}
    >
      {title}
    </button>
  ),
}))

jest.mock('./LLMSettingsDropdown', () => ({
  LLMSettingsDropdown: ({ renderTrigger, isVisible, disabled }) => (
    <div>
      {
        disabled
          ? (
            <button
              data-testid='settings-button'
              disabled
            />
          )
          : renderTrigger()
      }
      {
        isVisible && <div data-testid='dropdown' />
      }
    </div>
  ),
}))

jest.mock('../hooks', () => ({
  useChatSettings: jest.fn(() => ({
    activeLLMSettings: mockLLMSettings,
    setActiveLLMSettings: mockSetActiveLLMSettings,
  })),
}))

const mockSetActiveLLMSettings = jest.fn()

const mockLLMSettings = new LLMSettings({
  model: 'modelCode',
  provider: 'providerCode',
})

const mockProviders = [
  new LLMProvider({
    code: 'providerCode',
    name: 'Provider Name',
    models: [
      new LLModel({
        name: 'Model Name',
        code: 'modelCode',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
      new LLModel({
        name: 'Model Name 1',
        code: 'modelCode1',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
    ],
  }),
]

test('shows loading spinner when fetching', () => {
  useFetchLLMsQuery.mockImplementationOnce(() => ({
    providers: [],
    isFetching: true,
    isError: false,
  }))

  render(<LLMSettingsButton disabled={false} />)

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows nothing if not fetching and no activeLLMSettings', () => {
  useChatSettings.mockImplementationOnce(() => ({
    activeLLMSettings: null,
    setActiveLLMSettings: mockSetActiveLLMSettings,
  }))

  const { container } = render(<LLMSettingsButton disabled={false} />)

  expect(container).toBeEmptyDOMElement()
})

test('shows notification message in case of llms fetching failure', () => {
  useFetchLLMsQuery.mockImplementationOnce(() => ({
    providers: [],
    isFetching: false,
    isError: true,
  }))

  render(<LLMSettingsButton disabled={false} />)

  expect(notifyWarning).nthCalledWith(1, localize(Localization.FETCH_LLMS_FAILURE_MESSAGE))
})

test('sets first model as active if here is no activeLLMSettings', async () => {
  useChatSettings.mockImplementationOnce(() => ({
    activeLLMSettings: null,
    setActiveLLMSettings: mockSetActiveLLMSettings,
  }))

  render(<LLMSettingsButton disabled={false} />)

  expect(mockSetActiveLLMSettings).nthCalledWith(1,
    {
      model: mockProviders[0].models[0].code,
      provider: mockProviders[0].code,
    },
  )
})

test('renders settings button with model name', () => {
  render(<LLMSettingsButton disabled={false} />)

  expect(screen.getByTestId('settings-button')).toHaveTextContent('Model Name')
})

test('disables dropdown if disabled prop is true', () => {
  render(<LLMSettingsButton disabled={true} />)

  expect(screen.getByTestId('settings-button')).toBeDisabled()
})

test('opens dropdown on button click', async () => {
  render(<LLMSettingsButton disabled={false} />)

  await userEvent.click(screen.getByTestId('settings-button'))

  await waitFor(() => {
    expect(screen.getByTestId('dropdown')).toBeInTheDocument()
  })
})
