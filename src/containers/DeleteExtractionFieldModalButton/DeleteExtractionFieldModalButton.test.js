
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DeleteExtractionFieldModalButton } from './DeleteExtractionFieldModalButton'

const mockDeleteExtractionField = jest.fn(() => ({
  unwrap: jest.fn(),
}))

jest.mock('@/apiRTK/extractionFieldsApi', () => ({
  useDeleteExtractionFieldMutation: jest.fn(() => ([
    mockDeleteExtractionField,
    { isLoading: false },
  ])),
}))

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
Modal.confirm = jest.fn()

const deleteIconTestId = 'delete-icon'
jest.mock('@/components/Icons/TrashIcon', () => ({
  TrashIcon: () => <div data-testid={deleteIconTestId} />,
}))

const mockDocumentTypeCode = 'mockDocTypeCode'
const mockFieldCode = 'mockFieldCode'

const mockDocumentTypeField = new DocumentTypeField(
  mockFieldCode,
  'Field name',
  {},
  FieldType.STRING,
  true,
  0,
  'documentTypeCode',
  0,
)

test('call Modal.confirm with correct arguments in case of button click', async () => {
  const props = {
    documentTypeCode: mockDocumentTypeCode,
    field: mockDocumentTypeField,
    onAfterDelete: jest.fn(),
  }

  render(<DeleteExtractionFieldModalButton {...props} />)

  const deleteButton = screen.getByTestId(deleteIconTestId)

  await userEvent.click(deleteButton)

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_FIELD_CONFIRM_MESSAGE),
    onOk: expect.any(Function),
  })
})

test('call deleteExtractionField api when clicking on modal confirm', async () => {
  const props = {
    documentTypeCode: mockDocumentTypeCode,
    field: mockDocumentTypeField,
    onAfterDelete: jest.fn(),
  }

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(<DeleteExtractionFieldModalButton {...props} />)

  const deleteButton = screen.getByTestId(deleteIconTestId)

  await userEvent.click(deleteButton)

  expect(mockDeleteExtractionField).nthCalledWith(
    1,
    {
      documentTypeCode: mockDocumentTypeCode,
      fieldCodes: [mockDocumentTypeField.code],
    },
  )
})

test('call notifySuccess and onAfterDelete prop in case deletion was successful', async () => {
  jest.clearAllMocks()

  const mockOnAfterDelete = jest.fn()

  const props = {
    documentTypeCode: mockDocumentTypeCode,
    field: mockDocumentTypeField,
    onAfterDelete: mockOnAfterDelete,
  }

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(<DeleteExtractionFieldModalButton {...props} />)

  const deleteButton = screen.getByTestId(deleteIconTestId)

  await userEvent.click(deleteButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.DELETE_SUCCESS, { name: mockDocumentTypeField.name }),
  )
  expect(mockOnAfterDelete).toHaveBeenCalledTimes(1)
})

test('call notifyWarning in case deletion has failed', async () => {
  jest.clearAllMocks()

  const props = {
    documentTypeCode: mockDocumentTypeCode,
    field: mockDocumentTypeField,
    onAfterDelete: jest.fn(),
  }

  mockDeleteExtractionField.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error())),
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(<DeleteExtractionFieldModalButton {...props} />)

  const deleteButton = screen.getByTestId(deleteIconTestId)

  await userEvent.click(deleteButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})
