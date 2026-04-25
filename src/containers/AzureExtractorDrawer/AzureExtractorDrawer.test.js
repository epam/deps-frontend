
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Localization, localize } from '@/localization/i18n'
import { AzureCredentials, AzureExtractor } from '@/models/AzureExtractor'
import { render } from '@/utils/rendererRTL'
import { AzureExtractorDrawer } from './AzureExtractorDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)

jest.mock('./AzureExtractorForm', () => ({
  AzureExtractorForm: ({ setAreCredentialsValid }) => (
    <input
      onChange={() => setAreCredentialsValid(true)}
    />
  ),
}))

useForm.mockImplementation(() => ({
  formState: {
    isValid: true,
    isDirty: true,
  },
  getValues: jest.fn(() => mockFormValues),
}))

const mockAzureExtractor = new AzureExtractor({
  name: 'Extractor Name',
  credentials: new AzureCredentials({
    modelId: 'testModelId',
    endpoint: 'url@test.com',
  }),
})

const mockFormValues = {
  name: 'Extractor Name',
  modelId: 'testModelId',
  apiKey: 'testApiKey',
  endpoint: 'url@test.com',
}

const OPEN_DRAWER_BUTTON = 'Open Drawer'

const fillAndSubmit = async () => {
  const input = screen.getByRole('textbox')
  await userEvent.type(input, mockFormValues.name)

  const submitButton = screen.getByRole('button', { name: localize(Localization.SUBMIT) })
  await userEvent.click(submitButton)
}

test('shows drawer with correct title on trigger click in case of extractor creation', async () => {
  render(
    <AzureExtractorDrawer
      isLoading={false}
      onSave={jest.fn()}
    >
      {OPEN_DRAWER_BUTTON}
    </AzureExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.ADD_AZURE_CLOUD_NATIVE_EXTRACTOR))).toBeInTheDocument()
})

test('should call onSave function on submit button click', async () => {
  const mockOnSave = jest.fn()

  render(
    <AzureExtractorDrawer
      isLoading={false}
      onSave={mockOnSave}
    >
      {OPEN_DRAWER_BUTTON}
    </AzureExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))
  await fillAndSubmit()

  expect(mockOnSave).nthCalledWith(1, mockFormValues)
})

test('shows drawer with correct title on trigger click in case of extractor editing', async () => {
  render(
    <AzureExtractorDrawer
      extractorData={mockAzureExtractor}
      isConnectionDataLoading={false}
      isLoading={false}
      onSave={jest.fn()}
    >
      {OPEN_DRAWER_BUTTON}
    </AzureExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.EDIT_AZURE_CLOUD_NATIVE_EXTRACTOR))).toBeInTheDocument()
})

test('should disable the Submit button when form is invalid', async () => {
  useForm.mockImplementation(() => ({
    formState: {
      isValid: false,
      isDirty: true,
    },
  }))

  render(
    <AzureExtractorDrawer
      isLoading={false}
      onSave={jest.fn()}
    >
      {OPEN_DRAWER_BUTTON}
    </AzureExtractorDrawer>,
  )

  await userEvent.click(screen.getByText(OPEN_DRAWER_BUTTON))
  await fillAndSubmit()

  const submitButton = screen.getByRole('button', { name: localize(Localization.SUBMIT) })
  expect(submitButton).toBeDisabled()
})
