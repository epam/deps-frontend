
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCheckAzureExtractorQuery } from '@/apiRTK/documentTypeApi'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { ExtractionType } from '@/enums/ExtractionType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { AzureExtractorValidationStatusButton } from './AzureExtractorValidationStatusButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

const mockSynchronizeAzureExtractor = jest.fn(() => ({
  unwrap: jest.fn(() => ({})),
}))

jest.mock('@/apiRTK/documentTypeApi', () => ({
  ...jest.requireActual('@/apiRTK/documentTypeApi'),
  useFetchAzureExtractorQuery: jest.fn(() => ({})),
  useCheckAzureExtractorQuery: jest.fn(() => mockResponse),

  useSynchronizeAzureExtractorMutation: jest.fn(() => ([
    mockSynchronizeAzureExtractor,
    { isLoading: false },
  ])),
}))

const mockCheckIcon = 'CheckIcon'
const mockErrorIcon = 'mockErrorIcon'
const mockExpiredKeyIcon = 'ExpiredKeyIcon'
const mockRotateIcon = 'RotateIcon'
const mockSpinnerIcon = 'SpinnerIcon'

jest.mock('@/components/Icons/CalendarXmark', () => ({
  CalendarXmark: () => mockExpiredKeyIcon,
}))

jest.mock('@/components/Icons/ErrorTriangleIcon', () => ({
  ErrorTriangleIcon: () => mockErrorIcon,
}))

jest.mock('@/components/Icons/FaCircleCheckIcon', () => ({
  FaCircleCheckIcon: () => mockCheckIcon,
}))

jest.mock('@/components/Icons/FaRotateIcon', () => ({
  FaRotateIcon: () => mockRotateIcon,
}))

jest.mock('@/components/Icons/SpinnerIcon', () => ({
  SpinnerIcon: () => mockSpinnerIcon,
}))

const mockRefetch = jest.fn()

const mockDocumentType = new DocumentType(
  'DocType',
  'Doc Type',
  null,
  null,
  ExtractionType.AZURE_CLOUD_EXTRACTOR,
)

const VALIDATION_STATUSES = {
  API_KEY_EXPIRED: 'API Key expired',
  ERROR: 'Error',
  SYNCHRONIZED: 'Synchronized',
  UNSYNCHRONIZED: 'Unsynchronized',
}

const mockResponse = {
  data: {
    status: VALIDATION_STATUSES.SYNCHRONIZED,
  },
  isFetching: false,
  error: null,
  refetch: mockRefetch,
}

test('shows correct status and tooltip if Azure Extractor checking is in progress', async () => {
  useCheckAzureExtractorQuery.mockImplementationOnce(() => ({
    ...mockResponse,
    isFetching: true,
  }))

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.hover(screen.getByRole('button'))

  expect(screen.getByText(mockSpinnerIcon)).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.CONNECTION_PROGRESS))
  })
})

test('shows correct status and tooltip if Azure Extractor is synchronized', async () => {
  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.hover(screen.getByRole('button'))

  expect(screen.getByText(mockCheckIcon)).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.SYNCHRONIZED))
  })
})

test('shows correct status and tooltip if Azure Extractor is unsynchronized', async () => {
  useCheckAzureExtractorQuery.mockImplementationOnce(() => ({
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.UNSYNCHRONIZED,
    },
  }))

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.hover(screen.getByRole('button'))

  expect(screen.getByText(mockRotateIcon)).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.RESYNCHRONIZE))
  })
})

test('calls synchronizeExtractor api on status button click if Azure Extractor is unsynchronized', async () => {
  useCheckAzureExtractorQuery.mockImplementationOnce(() => ({
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.UNSYNCHRONIZED,
    },
  }))

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.click(screen.getByRole('button'))

  expect(mockSynchronizeAzureExtractor).nthCalledWith(
    1,
    { documentTypeId: mockDocumentType.code },
  )
})

test('should call success notification on successful Azure Extractor resynchronize', async () => {
  useCheckAzureExtractorQuery.mockImplementationOnce(() => ({
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.UNSYNCHRONIZED,
    },
  }))

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.click(screen.getByRole('button'))

  expect(notifySuccess).nthCalledWith(1, localize(Localization.AZURE_EXTRACTOR_SUCCESS_RESYNCHRONIZE))
})

test('should display error notification if synchronizeExtractor fails with known error', async () => {
  const errorCode = ErrorCode.azureExtractorInvalidCredentials
  const mockError = {
    data: {
      code: errorCode,
    },
  }
  mockSynchronizeAzureExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  useCheckAzureExtractorQuery.mockImplementationOnce(() => ({
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.UNSYNCHRONIZED,
    },
  }))

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.click(screen.getByRole('button'))

  expect(notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[errorCode],
  )
})

test('should display error notification if synchronizeExtractor fails with unknown error', async () => {
  jest.clearAllMocks()

  mockSynchronizeAzureExtractor.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error('Synchronization failed'))),
  }))

  useCheckAzureExtractorQuery.mockImplementationOnce(() => ({
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.UNSYNCHRONIZED,
    },
  }))

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.click(screen.getByRole('button'))

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR_MESSAGE),
  )
})

test('shows correct status and tooltip if Azure Extractor API Key expired', async () => {
  const mockAPIKeyExpiredResponse = {
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.API_KEY_EXPIRED,
      description: 'Test error',
    },
  }

  useCheckAzureExtractorQuery.mockImplementationOnce(() => mockAPIKeyExpiredResponse)

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.hover(screen.getByRole('button'))

  expect(screen.getByText(localize(Localization.EXPIRED_API_KEY))).toBeInTheDocument()
  expect(screen.getByText(mockExpiredKeyIcon)).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(localize(Localization.CHANGE_API_KEY))
  })
})

test('shows EditAzureExtractorDrawer on status button click if Azure Extractor API Key expired', async () => {
  const mockAPIKeyExpiredResponse = {
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.API_KEY_EXPIRED,
    },
  }

  useCheckAzureExtractorQuery.mockImplementationOnce(() => mockAPIKeyExpiredResponse)

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.click(screen.getByRole('button'))

  expect(screen.getByTestId('drawer')).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.EDIT_AZURE_CLOUD_NATIVE_EXTRACTOR))).toBeInTheDocument()
})

test('shows correct status and tooltip if Azure Extractor checker returns specified error', async () => {
  const mockErrorResponse = {
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.ERROR,
      description: 'Test error',
    },
  }

  useCheckAzureExtractorQuery.mockImplementationOnce(() => mockErrorResponse)

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.hover(screen.getByRole('button'))

  expect(screen.getByText(localize(Localization.SPECIFIC_ERROR))).toBeInTheDocument()
  expect(screen.getByText(mockRotateIcon)).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.getByRole('tooltip')).toHaveTextContent(mockErrorResponse.data.description)
  })
})

test('calls refetch on status button click if Azure Extractor checker returns specified error', async () => {
  const mockErrorResponse = {
    ...mockResponse,
    data: {
      status: VALIDATION_STATUSES.ERROR,
      description: 'Test error',
    },
  }

  useCheckAzureExtractorQuery.mockImplementationOnce(() => mockErrorResponse)

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )

  await userEvent.click(screen.getByRole('button'))

  expect(mockRefetch).toHaveBeenCalled()
})

test('shows correct status if Azure Extractor checking failed', async () => {
  useCheckAzureExtractorQuery.mockImplementationOnce(() => ({
    data: {},
    error: {
      code: 'Test error code',
    },
  }))

  render(
    <AzureExtractorValidationStatusButton
      documentType={mockDocumentType}
    />,
  )
  expect(screen.getByText(localize(Localization.UNSPECIFIED_ERROR))).toBeInTheDocument()
  expect(screen.getByText(mockErrorIcon)).toBeInTheDocument()
})
