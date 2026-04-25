
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchDocumentType } from '@/actions/documentType'
import { createExtraField } from '@/api/enrichmentApi'
import { DocumentTypeExtras } from '@/enums/DocumentTypeExtras'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { ExtendedDocumentType } from '@/models/ExtendedDocumentType'
import { documentTypeStateSelector } from '@/selectors/documentType'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { AddExtraFieldSection } from './AddExtraFieldSection'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentType')
jest.mock('@/api/enrichmentApi', () => ({
  createExtraField: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/actions/documentType', () => ({
  fetchDocumentType: jest.fn(),
}))

const mockDocumentTypeCode = 'DocType1234'

const mockSaveParams = new DocumentTypeExtraField({
  name: 'Extra Field Name',
  order: 0,
})

const mockDocumentType = new ExtendedDocumentType({
  code: mockDocumentTypeCode,
  name: 'Document Type',
})

beforeEach(() => {
  jest.clearAllMocks()
  documentTypeStateSelector.mockReturnValue(mockDocumentType)
})

const changeFieldName = async () => {
  const trigger = screen.getByRole('heading', {
    level: 3,
    name: localize(Localization.EXTRA_FIELD),
  })

  await userEvent.click(trigger)

  const input = screen.getByPlaceholderText('Enter Name')
  const submitButton = screen.getByRole('button', {
    name: localize(Localization.CREATE),
  })

  await userEvent.type(input, mockSaveParams.name)
  await userEvent.click(submitButton)
}

test('shows extra field adding drawer in case of trigger click', async () => {
  render(<AddExtraFieldSection />)

  const trigger = screen.getByRole('heading', {
    level: 3,
    name: localize(Localization.EXTRA_FIELD),
  })

  await userEvent.click(trigger)

  const drawer = screen.getByTestId('drawer')
  const drawerTitle = screen.getByText(
    localize(Localization.ADD_EXTRA_FIELD),
  )

  expect(drawerTitle).toBeInTheDocument()
  expect(drawer).toBeInTheDocument()
})

test('calls create extra field api with correct parameters when create new field', async () => {
  render(<AddExtraFieldSection />)

  await changeFieldName()

  expect(createExtraField).nthCalledWith(
    1,
    mockDocumentTypeCode,
    {
      name: mockSaveParams.name,
      order: mockSaveParams.order,
    },
  )
})

test('calls notifySuccess and fetchDocumentType in case field creation was successful', async () => {
  render(<AddExtraFieldSection />)

  await changeFieldName()

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.FIELD_CREATION_SUCCESS_MESSAGE),
  )

  expect(fetchDocumentType).nthCalledWith(
    1,
    mockDocumentTypeCode,
    [DocumentTypeExtras.EXTRA_FIELDS],
  )
})

test('calls notifyWarning with default message in case adding failed with unknown error code', async () => {
  const mockUnknownError = new Error()
  createExtraField.mockImplementationOnce(() => Promise.reject(mockUnknownError))

  render(<AddExtraFieldSection />)

  await changeFieldName()

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      localize(Localization.DEFAULT_ERROR),
    )
  })
})

test('calls notifyWarning with correct message in case adding failed with known error code', async () => {
  const errorCode = ErrorCode.alreadyExistsError
  const mockError = {
    response: {
      data: {
        code: errorCode,
      },
    },
  }

  createExtraField.mockImplementationOnce(() => Promise.reject(mockError))

  render(<AddExtraFieldSection />)

  await changeFieldName()

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      RESOURCE_ERROR_TO_DISPLAY[errorCode],
    )
  })
})
