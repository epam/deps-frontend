
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { renderHook } from '@testing-library/react-hooks'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Localization,
  localize,
} from '@/localization/i18n'
import { AzureCredentials, AzureExtractor } from '@/models/AzureExtractor'
import { render } from '@/utils/rendererRTL'
import { AzureExtractorForm } from './AzureExtractorForm'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./AzureCredentialsValidator', () => ({
  AzureCredentialsValidator: () => <div data-testid='credentials-validator' />,
}))

const defaultLanguageValue = localize(Localization.AUTODETECTED)

const mockAzureExtractor = new AzureExtractor({
  name: 'Extractor Name',
  credentials: new AzureCredentials({
    modelId: 'testModelId',
    endpoint: 'url@test.com',
  }),
})

const { result } = renderHook(() =>
  useForm({
    defaultValues: {
      language: defaultLanguageValue,
    },
  }),
)
const methods = result.current

test('displays form layout correctly', () => {
  render(
    <FormProvider {...methods}>
      <AzureExtractorForm
        setAreCredentialsValid={jest.fn()}
      />
    </FormProvider>,
  )

  const inputs = screen.getAllByRole('textbox')
  const [, languageInput] = inputs

  expect(screen.getByText(localize(Localization.NAME))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))).toBeInTheDocument()

  expect(screen.getByText(localize(Localization.LANGUAGE))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR_LANGUAGE_HINT))).toBeInTheDocument()
  expect(languageInput).toBeDisabled()
  expect(languageInput).toHaveValue(defaultLanguageValue)
})

test('displays Connection data section correctly', () => {
  render(
    <FormProvider {...methods}>
      <AzureExtractorForm
        setAreCredentialsValid={jest.fn()}
      />
    </FormProvider>,
  )

  const apiKeyInput = screen.getByPlaceholderText(localize(Localization.ENTER_KEY))

  expect(screen.getByText(localize(Localization.CONNECTION_DATA))).toBeInTheDocument()

  expect(screen.getByText(localize(Localization.MODEL_ID))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.ENTER_MODEL))).toBeInTheDocument()

  expect(screen.getByText(localize(Localization.ENDPOINT))).toBeInTheDocument()
  expect(screen.getByPlaceholderText(localize(Localization.ENTER_LINK))).toBeInTheDocument()

  expect(screen.getByText(localize(Localization.API_KEY))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.API_KEY_HINT))).toBeInTheDocument()
  expect(apiKeyInput).toBeInTheDocument()
  expect(apiKeyInput.type).toEqual('password')

  expect(screen.getByTestId('credentials-validator')).toBeInTheDocument()
})

test('displays form layout correctly if initial extractor data passed', () => {
  render(
    <FormProvider {...methods}>
      <AzureExtractorForm
        extractorData={mockAzureExtractor}
        setAreCredentialsValid={jest.fn()}
      />
    </FormProvider>,
  )

  const inputs = screen.getAllByRole('textbox')
  const [nameInput,, modelIdInput, endpointInput] = inputs

  expect(nameInput).toHaveValue(mockAzureExtractor.name)
  expect(modelIdInput).toHaveValue(mockAzureExtractor.credentials.modelId)
  expect(endpointInput).toHaveValue(mockAzureExtractor.credentials.endpoint)
})

test('displays form layout correctly if connection data is loading', () => {
  const mockAzureExtractor = new AzureExtractor({
    name: 'Extractor Name',
    credentials: new AzureCredentials({
      modelId: null,
      endpoint: null,
    }),
  })

  render(
    <FormProvider {...methods}>
      <AzureExtractorForm
        extractorData={mockAzureExtractor}
        isConnectionDataLoading={true}
        setAreCredentialsValid={jest.fn()}
      />
    </FormProvider>,
  )

  const inputs = screen.getAllByRole('textbox')
  const [nameInput] = inputs

  expect(nameInput).toHaveValue(mockAzureExtractor.name)

  expect(screen.getByText(localize(Localization.CONNECTION_DATA))).toBeInTheDocument()
  expect(screen.getByTestId('spin')).toBeInTheDocument()
})
