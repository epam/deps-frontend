
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import {
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DeleteFieldButton } from './DeleteFieldButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

Modal.confirm = jest.fn()

const mockSupplement = new DocumentSupplement({
  code: 'mockSupplementCode1',
  name: 'mockSupplementName1',
  type: FieldType.STRING,
  value: 'mockSupplementValue1',
})

const mockSupplementToRemove = new DocumentSupplement({
  code: 'mockSupplementCode2',
  name: 'mockSupplementName2',
  type: FieldType.STRING,
  value: 'mockSupplementValue2',
})

const mockDocumentSupplements = [mockSupplement, mockSupplementToRemove]
const mockDocumentId = 'documentId'
const mockDocumentTypeCode = 'DocTypeCode'

const mockCreateOrUpdateSupplementsFn = jest.fn(() => ({
  unwrap: () => Promise.resolve({}),
}))

jest.mock('@/apiRTK/documentSupplementsApi', () => ({
  useCreateOrUpdateSupplementsMutation: jest.fn(() => ([
    mockCreateOrUpdateSupplementsFn,
    { isLoading: false },
  ])),
}))

test('shows disabled button and correct tooltip message if the field belongs to a document type', async () => {
  render(
    <DeleteFieldButton
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      isDocumentTypeField={true}
      supplement={mockSupplementToRemove}
    />,
  )

  const deleteButton = screen.getByRole('button', {
    name: localize(Localization.DELETE),
  })

  await userEvent.hover(deleteButton, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(deleteButton).toBeDisabled()

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(localize(Localization.SUPPLEMENT_FIELD_DELETION_IS_NOT_ALLOWED))
  })
})

test('calls Modal.confirm with correct arguments in case of button click', async () => {
  render(
    <DeleteFieldButton
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      isDocumentTypeField={false}
      supplement={mockSupplementToRemove}
    />,
  )

  const deleteButton = screen.getByRole('button', {
    name: localize(Localization.DELETE),
  })

  await userEvent.click(deleteButton)

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_FIELD_CONFIRM_MESSAGE),
    onOk: expect.any(Function),
  })
})

test('calls createOrUpdateSupplements api when clicking on modal confirm', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <DeleteFieldButton
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      isDocumentTypeField={false}
      supplement={mockSupplementToRemove}
    />,
  )

  const deleteButton = screen.getByRole('button', {
    name: localize(Localization.DELETE),
  })

  await userEvent.click(deleteButton)

  expect(mockCreateOrUpdateSupplementsFn).nthCalledWith(
    1,
    {
      documentId: mockDocumentId,
      documentTypeId: mockDocumentTypeCode,
      data: [mockSupplement],
    },
  )
})

test('call notifySuccess in case deletion was successful', async () => {
  jest.clearAllMocks()

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <DeleteFieldButton
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      isDocumentTypeField={false}
      supplement={mockSupplementToRemove}
    />,
  )

  const deleteButton = screen.getByRole('button', {
    name: localize(Localization.DELETE),
  })

  await userEvent.click(deleteButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.DELETE_SUCCESS, { name: mockSupplementToRemove.name }),
  )
})

test('shows an error if deletion fails', async () => {
  jest.clearAllMocks()

  const mockError = new Error('')
  mockCreateOrUpdateSupplementsFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <DeleteFieldButton
      disabled={false}
      documentId={mockDocumentId}
      documentSupplements={mockDocumentSupplements}
      documentTypeCode={mockDocumentTypeCode}
      isDocumentTypeField={false}
      supplement={mockSupplementToRemove}
    />,
  )

  const deleteButton = screen.getByRole('button', {
    name: localize(Localization.DELETE),
  })

  await userEvent.click(deleteButton)

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
  })
})
