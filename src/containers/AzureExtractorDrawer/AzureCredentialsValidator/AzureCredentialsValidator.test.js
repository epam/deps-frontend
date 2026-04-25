
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import lodashDebounce from 'lodash/debounce'
import { useValidateAzureExtractorCredentialsMutation } from '@/apiRTK/documentTypeApi'
import { Localization, localize } from '@/localization/i18n'
import { AzureCredentials } from '@/models/AzureExtractor'
import { render } from '@/utils/rendererRTL'
import { AzureCredentialsValidator } from './AzureCredentialsValidator'

jest.mock('lodash/debounce', () =>
  jest.fn((fn) => fn),
)

const mockValidateAzureExtractorCredentials = jest.fn(() => ({
  unwrap: jest.fn(() => ({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useValidateAzureExtractorCredentialsMutation: jest.fn(() => ([
    mockValidateAzureExtractorCredentials,
    { isLoading: false },
  ])),
}))

jest.mock('@/utils/env', () => mockEnv)

const mockIconContent = 'ErrorIcon'

jest.mock('@/components/Icons/ErrorIcon', () => ({
  ErrorIcon: () => <span>{mockIconContent}</span>,
}))

const DEBOUNCE_TIME = 300

const mockCredentials = new AzureCredentials({
  apiKey: 'testApiKey',
  endpoint: 'url@test.com',
  modelId: 'testModelId',
})

test('shows go to azure button', async () => {
  render(
    <AzureCredentialsValidator
      credentials={mockCredentials}
      setAreCredentialsValid={jest.fn()}
    />,
  )

  const goToAzureButton = screen.getByRole('button', {
    name: localize(Localization.GO_TO_AZURE),
  })

  await waitFor(() => {
    expect(goToAzureButton).toBeInTheDocument()
  })
})

test('shows proper message if credentials was not validated yet', async () => {
  const mockCredentials = new AzureCredentials({
    apiKey: '',
    endpoint: '',
    modelId: '',
  })

  render(
    <AzureCredentialsValidator
      credentials={mockCredentials}
      setAreCredentialsValid={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(screen.getByText(localize(Localization.CONNECTION_NOT_VALIDATED))).toBeInTheDocument()
  })
})

test('shows proper message and calls setAreCredentialsValid if credentials validation is in progress', async () => {
  const mockCredentials = new AzureCredentials({
    apiKey: '',
    endpoint: '',
    modelId: '',
  })
  const mockSetAreCredentialsValid = jest.fn()

  useValidateAzureExtractorCredentialsMutation.mockImplementationOnce(() => ([
    mockValidateAzureExtractorCredentials,
    { isLoading: true },
  ]))

  render(
    <AzureCredentialsValidator
      credentials={mockCredentials}
      setAreCredentialsValid={mockSetAreCredentialsValid}
    />,
  )

  await waitFor(() => {
    expect(screen.getByText(localize(Localization.CONNECTION_VALIDATION_PROGRESS))).toBeInTheDocument()
  })
  expect(mockSetAreCredentialsValid).nthCalledWith(1, false)
})

test('shows proper message and calls setAreCredentialsValid if credentials validation was successful', async () => {
  const mockSetAreCredentialsValid = jest.fn()

  render(
    <AzureCredentialsValidator
      credentials={mockCredentials}
      setAreCredentialsValid={mockSetAreCredentialsValid}
    />,
  )

  await waitFor(() => {
    expect(screen.getByText(localize(Localization.CONNECTION_VALIDATION_SUCCESS))).toBeInTheDocument()
  })
  expect(mockSetAreCredentialsValid).nthCalledWith(1, true)
})

test('shows proper message and calls setAreCredentialsValid if credentials validation failed', async () => {
  const mockSetAreCredentialsValid = jest.fn()

  mockValidateAzureExtractorCredentials.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error('Test error'))),
  }))

  render(
    <AzureCredentialsValidator
      credentials={mockCredentials}
      setAreCredentialsValid={mockSetAreCredentialsValid}
    />,
  )

  await waitFor(() => {
    expect(screen.getByText(localize(Localization.CONNECTION_VALIDATION_ERROR))).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByText(mockIconContent)).toBeInTheDocument()
  })

  expect(mockSetAreCredentialsValid).nthCalledWith(1, false)
})

test('calls validateAzureCredential api with proper arguments', async () => {
  jest.clearAllMocks()

  render(
    <AzureCredentialsValidator
      credentials={mockCredentials}
      setAreCredentialsValid={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(mockValidateAzureExtractorCredentials).nthCalledWith(1, mockCredentials)
  })
})

test('does not call validateAzureCredential api if credentials are not filled', async () => {
  jest.clearAllMocks()

  const mockCredentials = new AzureCredentials({
    apiKey: 'testApiKey',
    endpoint: 'url@test.com',
    modelId: '',
  })

  render(
    <AzureCredentialsValidator
      credentials={mockCredentials}
      setAreCredentialsValid={jest.fn()}
    />,
  )

  expect(mockValidateAzureExtractorCredentials).not.toBeCalled()
})

test('calls validateAzureCredential api with trimmed credentials values', async () => {
  jest.clearAllMocks()

  const mockCredentialsWithSpaces = new AzureCredentials({
    ...mockCredentials,
    modelId: `  ${mockCredentials.modelId}  `,
  })

  render(
    <AzureCredentialsValidator
      credentials={mockCredentialsWithSpaces}
      setAreCredentialsValid={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(mockValidateAzureExtractorCredentials).nthCalledWith(1, mockCredentials)
  })
})

test('calls debounce function with proper delay time', async () => {
  render(
    <AzureCredentialsValidator
      credentials={mockCredentials}
      setAreCredentialsValid={jest.fn()}
    />,
  )

  await waitFor(() => {
    expect(lodashDebounce).nthCalledWith(
      1,
      expect.any(Function),
      DEBOUNCE_TIME,
    )
  })
})
