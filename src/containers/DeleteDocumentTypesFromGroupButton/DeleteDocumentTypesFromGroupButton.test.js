
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { DeleteDocumentTypesFromGroupButton } from './DeleteDocumentTypesFromGroupButton'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useDeleteDocumentTypesFromGroupMutation: jest.fn(() => [mockDeleteDocumentTypesFn]),
}))

Modal.confirm = jest.fn()

const deleteDocumentTypeUnwrappedFn = jest.fn(() => Promise.resolve())
const mockDeleteDocumentTypesFn = jest.fn(() => ({
  unwrap: deleteDocumentTypeUnwrappedFn,
}))

const MockTrigger = (onClick) => (
  <button
    data-testid='delete-trigger'
    onClick={onClick}
  />
)

test('calls Modal.confirm with correct arguments in case of trigger click', async () => {
  const props = {
    groupId: 'mockGroupId',
    documentTypeIds: ['mockDocTypeId'],
    renderTrigger: MockTrigger,
  }

  render(<DeleteDocumentTypesFromGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_SELECTED_DOCUMENT_TYPES_FROM_GROUP),
    onOk: expect.any(Function),
  })
})

test('calls correct delete api with correct argument when clicking on modal confirm', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    groupId: 'mockGroupId',
    documentTypeIds: ['mockDocTypeId'],
    renderTrigger: MockTrigger,
  }

  render(<DeleteDocumentTypesFromGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockDeleteDocumentTypesFn).nthCalledWith(1, {
    id: props.documentTypeIds,
    groupId: props.groupId,
  })
})

test('calls notifySuccess and onAfterDelete prop in case of successful deletion', async () => {
  jest.clearAllMocks()

  Modal.confirm.mockImplementationOnce((config) => config.onOk())
  const mockOnAfterDelete = jest.fn()

  const props = {
    groupId: 'mockGroupId',
    documentTypeIds: ['mockDocTypeId'],
    renderTrigger: MockTrigger,
    onAfterDelete: mockOnAfterDelete,
  }

  render(<DeleteDocumentTypesFromGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.SELECTED_DOCUMENT_TYPES_SUCCESS_DELETION),
  )

  expect(mockOnAfterDelete).toHaveBeenCalled()
})

test('calls notifyWarning with correct message in case of delete rejection with unknown error code', async () => {
  jest.clearAllMocks()

  const mockError = new Error('test')
  const mockRejectedUnwrapFn = () => Promise.reject(mockError)

  mockDeleteDocumentTypesFn.mockImplementationOnce(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    groupId: 'mockGroupId',
    documentTypeIds: ['mockDocTypeId'],
    renderTrigger: MockTrigger,
  }

  render(<DeleteDocumentTypesFromGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('calls notifyWarning with correct message in case of delete rejection with known code', async () => {
  jest.clearAllMocks()

  const mockError = {
    data: {
      code: ErrorCode.illegal_argument,
    },
  }

  const mockRejectedUnwrapFn = () => Promise.reject(mockError)

  mockDeleteDocumentTypesFn.mockImplementationOnce(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    groupId: 'mockGroupId',
    documentTypeIds: ['mockDocTypeId'],
    renderTrigger: MockTrigger,
  }

  render(<DeleteDocumentTypesFromGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[ErrorCode.illegal_argument],
  )
})
