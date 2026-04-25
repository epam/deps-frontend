
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LLMModelContextType } from '@/enums/LLMModelContextType'
import { Localization, localize } from '@/localization/i18n'
import {
  LLModel,
  LLMProvider,
  LLMSettings,
} from '@/models/LLMProvider'
import { render } from '@/utils/rendererRTL'
import { SelectLLMSettingsButton } from './SelectLLMSettingsButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/genAiChat')

const mockActiveLLMSettings = new LLMSettings({
  provider: 'dial',
  model: 'dial-turbo',
})

const mockProviders = [
  new LLMProvider({
    code: 'dial',
    name: 'Provider',
    models: [
      new LLModel({
        name: 'model',
        code: 'dial-turbo',
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

test('renders SelectLLMSettingsButton correctly', () => {
  const props = {
    activeLLMSettings: mockActiveLLMSettings,
    isLoading: false,
    setActiveLLMSettings: jest.fn(),
    providers: mockProviders,
  }

  render(<SelectLLMSettingsButton {...props} />)

  const button = screen.getByRole('button', {
    name: `${mockProviders[0].name} | ${mockProviders[0].models[0].name}`,
  })

  expect(button).toBeInTheDocument()
})

test('disables trigger button when no providers are available', () => {
  const props = {
    activeLLMSettings: null,
    isLoading: false,
    setActiveLLMSettings: jest.fn(),
    providers: [],
  }

  render(<SelectLLMSettingsButton {...props} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.SELECT_LLM_TYPE),
  })

  expect(button).toBeDisabled()
})

test('enables trigger button when providers exist but no activeLLMSettings', () => {
  const props = {
    activeLLMSettings: null,
    isLoading: false,
    setActiveLLMSettings: jest.fn(),
    providers: mockProviders,
  }

  render(<SelectLLMSettingsButton {...props} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.SELECT_LLM_TYPE),
  })

  expect(button).toBeEnabled()
})

test('does not render SelectLLMSettingsButton if activeLLMSettings are not provided', () => {
  const props = {
    activeLLMSettings: null,
    isLoading: false,
    setActiveLLMSettings: jest.fn(),
    providers: mockProviders,
  }

  render(<SelectLLMSettingsButton {...props} />)

  const button = screen.queryByRole('button', {
    name: `${mockProviders[0].name} | ${mockProviders[0].models[0].name}`,
  })

  expect(button).not.toBeInTheDocument()
})

test('renders spinner if isLoading prop is true', () => {
  const props = {
    activeLLMSettings: mockActiveLLMSettings,
    isLoading: true,
    setActiveLLMSettings: jest.fn(),
    providers: mockProviders,
  }

  render(<SelectLLMSettingsButton {...props} />)

  const spinner = screen.getByTestId('spin')

  expect(spinner).toBeInTheDocument()
})

test('shows drawer when click on ToggleDrawerButton', async () => {
  const props = {
    activeLLMSettings: mockActiveLLMSettings,
    isLoading: false,
    setActiveLLMSettings: jest.fn(),
    providers: mockProviders,
  }

  render(<SelectLLMSettingsButton {...props} />)

  await userEvent.click(screen.getByRole('button', {
    name: `${mockProviders[0].name} | ${mockProviders[0].models[0].name}`,
  }))

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('calls setActiveLLMSettings when click on submit button', async () => {
  const props = {
    activeLLMSettings: mockActiveLLMSettings,
    isLoading: false,
    setActiveLLMSettings: jest.fn(),
    providers: mockProviders,
  }

  render(<SelectLLMSettingsButton {...props} />)

  await userEvent.click(screen.getByRole('button', {
    name: `${mockProviders[0].name} | ${mockProviders[0].models[0].name}`,
  }))

  await userEvent.click(screen.getByText(mockProviders[0].models[1].description))

  const submitBtn = screen.getByRole('button', {
    name: localize(Localization.SAVE),
  })

  expect(submitBtn).toBeInTheDocument()

  await userEvent.click(submitBtn)

  expect(props.setActiveLLMSettings).nthCalledWith(
    1,
    {
      model: mockProviders[0].models[1].code,
      provider: mockActiveLLMSettings.provider,
    },
  )
})
