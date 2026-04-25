
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ExtractionType } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { EditAzureExtractorDrawer } from './EditAzureExtractorDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

const mockUpdateAzureExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => ({})),
}))

const mockFetchAzureExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => ({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  useFetchAzureExtractorQuery: jest.fn(() => ([
    mockFetchAzureExtractor,
    { isLoading: false },
  ])),
  useUpdateAzureExtractorMutation: jest.fn(() => ([
    mockUpdateAzureExtractor,
    { isLoading: false },
  ])),
}))

jest.mock('@/containers/AzureExtractorDrawer', () => ({
  AzureExtractorDrawer: ({ onSave }) => (
    <div data-testid='drawer'>
      <button
        data-testid='submit-btn'
        onClick={() => onSave(mockFormValues)}
      />
    </div>
  ),
}))

const mockFormValues = {
  modelId: 'testModelId',
  apiKey: 'testApiKey',
  endpoint: 'url@test.com',
}

const mockDocumentType = new DocumentType(
  'DocType',
  'Doc Type',
  null,
  null,
  ExtractionType.AZURE_CLOUD_EXTRACTOR,
)

test('shows Azure Extractor drawer', async () => {
  render(
    <EditAzureExtractorDrawer
      documentType={mockDocumentType}
    />,
  )

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
})

test('should call updateAzureExtractor api with correct arguments on submit button click', async () => {
  render(
    <EditAzureExtractorDrawer
      documentType={mockDocumentType}
    />,
  )

  const editButton = screen.getByRole('button', localize(Localization.EDIT))
  await userEvent.click(editButton)

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(mockUpdateAzureExtractor).nthCalledWith(
    1,
    {
      documentTypeId: mockDocumentType.code,
      credentials: {
        apiKey: mockFormValues.apiKey,
        endpoint: mockFormValues.endpoint,
        modelId: mockFormValues.modelId,
      },
    },
  )
})

test('should call success notification on successful extractor updating', async () => {
  render(
    <EditAzureExtractorDrawer
      documentType={mockDocumentType}
    />,
  )

  const editButton = screen.getByRole('button', localize(Localization.EDIT))
  await userEvent.click(editButton)

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifySuccess).nthCalledWith(1, localize(Localization.AZURE_CLOUD_NATIVE_EXTRACTOR_SUCCESS_UPDATE))
})

test('should display error notification if updateAzureExtractor fails with known error', async () => {
  const errorCode = ErrorCode.azureExtractorInvalidCredentials
  const mockError = {
    data: {
      code: errorCode,
    },
  }
  mockUpdateAzureExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <EditAzureExtractorDrawer
      documentType={mockDocumentType}
    />,
  )

  const editButton = screen.getByRole('button', localize(Localization.EDIT))
  await userEvent.click(editButton)

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[errorCode],
  )
})

test('should display error notification if updateAzureExtractor fails with unknown error', async () => {
  jest.clearAllMocks()

  mockUpdateAzureExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error('Updating failed'))),
  }))

  render(
    <EditAzureExtractorDrawer
      documentType={mockDocumentType}
    />,
  )

  const editButton = screen.getByRole('button', localize(Localization.EDIT))
  await userEvent.click(editButton)

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR_MESSAGE),
  )
})
