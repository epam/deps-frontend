
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { deleteExtraFields } from '@/api/enrichmentApi'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypeExtraField } from '@/models/DocumentTypeExtraField'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { DeleteExtraFieldModalButton } from './DeleteExtraFieldModalButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/api/enrichmentApi', () => ({
  deleteExtraFields: jest.fn(() => Promise.resolve({})),
}))
jest.mock('@/utils/notification', () => mockNotification)
Modal.confirm = jest.fn()

const deleteIconTestId = 'delete-icon'
jest.mock('@/components/Icons/TrashIcon', () => ({
  TrashIcon: () => <div data-testid={deleteIconTestId} />,
}))

const mockDocumentTypeCode = 'mockDocTypeCode'
const mockDocumentTypeExtraFieldCode = 'mockCode'

const mockDocumentTypeExtraField = new DocumentTypeExtraField({
  code: mockDocumentTypeExtraFieldCode,
  name: 'mockName',
  order: 1,
})

test('call Modal.confirm with correct arguments in case of button click', async () => {
  const props = {
    documentTypeCode: mockDocumentTypeCode,
    field: mockDocumentTypeExtraField,
    onAfterDelete: jest.fn(),
  }

  render(<DeleteExtraFieldModalButton {...props} />)

  const deleteButton = screen.getByTestId(deleteIconTestId)

  await userEvent.click(deleteButton)

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_EXTRA_FIELD_CONFIRM_MESSAGE),
    onOk: expect.any(Function),
  })
})

test('call deleteExtraFields api when clicking on modal confirm', async () => {
  const props = {
    documentTypeCode: mockDocumentTypeCode,
    field: mockDocumentTypeExtraField,
    onAfterDelete: jest.fn(),
  }

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(<DeleteExtraFieldModalButton {...props} />)

  const deleteButton = screen.getByTestId(deleteIconTestId)

  await userEvent.click(deleteButton)

  expect(deleteExtraFields).nthCalledWith(
    1,
    mockDocumentTypeCode,
    [mockDocumentTypeExtraFieldCode],
  )
})

test('call notifySuccess and onAfterDelete prop in case deletion was successful', async () => {
  jest.clearAllMocks()

  const mockOnAfterDelete = jest.fn()

  const props = {
    documentTypeCode: mockDocumentTypeCode,
    field: mockDocumentTypeExtraField,
    onAfterDelete: mockOnAfterDelete,
  }

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(<DeleteExtraFieldModalButton {...props} />)

  const deleteButton = screen.getByTestId(deleteIconTestId)

  await userEvent.click(deleteButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.DELETE_SUCCESS, { name: mockDocumentTypeExtraField.name }),
  )
  expect(mockOnAfterDelete).toHaveBeenCalledTimes(1)
})

test('call notifyWarning in case deletion has failed', async () => {
  jest.clearAllMocks()

  const props = {
    documentTypeCode: mockDocumentTypeCode,
    field: mockDocumentTypeExtraField,
    onAfterDelete: jest.fn(),
  }

  deleteExtraFields.mockImplementation(() => Promise.reject(new Error('test')))
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(<DeleteExtraFieldModalButton {...props} />)

  const deleteButton = screen.getByTestId(deleteIconTestId)

  await userEvent.click(deleteButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})
