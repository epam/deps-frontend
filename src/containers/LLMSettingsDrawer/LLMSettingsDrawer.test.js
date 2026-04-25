
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import {
  LLModel,
  LLMProvider,
  LLMSettings,
} from '@/models/LLMProvider'
import { render } from '@/utils/rendererRTL'
import { LLMSettingsDrawer } from './LLMSettingsDrawer'

jest.mock('@/utils/env', () => mockEnv)

const mockActiveLLMSettings = new LLMSettings({
  provider: 'providerCode',
  model: 'modelCode',
})

const mockProviders = [
  new LLMProvider({
    code: 'providerCode',
    name: 'provider',
    models: [
      new LLModel({
        name: 'model',
        code: 'modelCode',
        description: 'description',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
      new LLModel({
        name: 'model1',
        code: 'modelCode1',
        description: 'description1',
        contextType: LLMModelContextType.TEXT_BASED,
      }),
    ],
  }),
]

test('render Drawer correctly', () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
    activeLLMSettings: mockActiveLLMSettings,
    providers: mockProviders,
    recentLLMsSettings: [],
  }

  render(<LLMSettingsDrawer {...props} />)

  expect(screen.getByText(localize(Localization.PROVIDER_AND_MODEL_SELECTION))).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.CANCEL) })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: localize(Localization.SAVE) })).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.PROVIDER))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.SEARCH_BY_MODELS))).toBeInTheDocument()
})

test('calls closeDrawer when click on cancel button', async () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
    activeLLMSettings: mockActiveLLMSettings,
    providers: mockProviders,
    recentLLMsSettings: [],
  }

  render(<LLMSettingsDrawer {...props} />)

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.CANCEL) }))

  expect(props.closeDrawer).toHaveBeenCalled()
})

test('save button is disabled if activeLLMSettings values are equal to current one', () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
    activeLLMSettings: mockActiveLLMSettings,
    providers: mockProviders,
    recentLLMsSettings: [],
  }

  render(<LLMSettingsDrawer {...props} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).toBeDisabled()
})

test('save button is disabled if no saved llm settings', () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
    activeLLMSettings: undefined,
    providers: mockProviders,
    recentLLMsSettings: [],
  }

  render(<LLMSettingsDrawer {...props} />)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })

  expect(saveButton).toBeDisabled()
})

test('calls onSubmit when click on create button', async () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
    activeLLMSettings: mockActiveLLMSettings,
    providers: mockProviders,
    recentLLMsSettings: [],
  }

  render(<LLMSettingsDrawer {...props} />)

  await userEvent.click(screen.getByText(mockProviders[0].models[1].description))

  await userEvent.click(screen.getByRole('button', { name: localize(Localization.SAVE) }))

  expect(props.onSubmit).toHaveBeenNthCalledWith(
    1,
    mockProviders[0].models[1].code,
    mockActiveLLMSettings.provider,
  )
})

test('shows recent LLMs section if llmsSettings prop is provided', () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
    activeLLMSettings: mockActiveLLMSettings,
    providers: mockProviders,
    recentLLMsSettings: [mockActiveLLMSettings],
  }

  render(<LLMSettingsDrawer {...props} />)

  expect(screen.getByText(localize(Localization.RECENT_MODELS))).toBeInTheDocument()
})

test('hide recent models list and providers select if search value is not empty', async () => {
  const props = {
    isLoading: false,
    onSubmit: jest.fn(),
    closeDrawer: jest.fn(),
    visible: true,
    activeLLMSettings: mockActiveLLMSettings,
    providers: mockProviders,
    recentLLMsSettings: [mockActiveLLMSettings],
  }

  render(<LLMSettingsDrawer {...props} />)

  const input = screen.getByPlaceholderText(localize(Localization.SEARCH_BY_MODELS))

  await userEvent.type(input, 'value')

  await waitFor(() => {
    expect(screen.queryByText(localize(Localization.RECENT_MODELS))).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(localize(Localization.PROVIDER))).not.toBeInTheDocument()
  })
})
