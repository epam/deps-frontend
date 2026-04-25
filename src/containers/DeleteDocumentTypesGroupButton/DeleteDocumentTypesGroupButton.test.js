
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { DeleteDocumentTypesGroupButton } from './DeleteDocumentTypesGroupButton'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/navigation', () => ({
  selectionSelector: jest.fn(() => [mockId]),
}))

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useDeleteDocumentTypesGroupMutation: jest.fn(() => [mockDeleteDocumentTypesGroupFunction]),
}))

Modal.confirm = jest.fn()

const mockId = 'id'
const deleteDocumentTypeUnwrappedFn = jest.fn(() => Promise.resolve())
const mockDeleteDocumentTypesGroupFunction = jest.fn(() => ({
  unwrap: deleteDocumentTypeUnwrappedFn,
}))

const MockContent = (onClick) => (
  <button
    data-testid='delete-trigger'
    onClick={onClick}
  />
)

const mockDocumentTypesGroup = new DocumentTypesGroup({
  id: mockId,
  name: 'DocumentTypesGroup',
  documentTypeIds: ['id1', 'id2', 'id3'],
  createdAt: '12-12-2012',
})

test('shows content according renderTrigger prop', async () => {
  const props = {
    group: mockDocumentTypesGroup,
    renderTrigger: MockContent,
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

  await waitFor(() => {
    expect(screen.getByTestId('delete-trigger')).toBeInTheDocument()
  })
})

test('calls Modal.confirm with correct arguments in case of button click', async () => {
  jest.clearAllMocks()

  const props = {
    group: mockDocumentTypesGroup,
    renderTrigger: MockContent,
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_DOC_TYPES_GROUP, { name: props.group.name }),
    onOk: expect.any(Function),
  })
})

test('calls Modal.confirm with correct arguments in case of button click and without group prop', async () => {
  jest.clearAllMocks()

  const props = {
    renderTrigger: MockContent,
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_DOC_TYPES_GROUPS),
    onOk: expect.any(Function),
  })
})

test('calls deleteDocumentTypesGroup with correct argument when clicking on modal confirm', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    group: mockDocumentTypesGroup,
    renderTrigger: MockContent,
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockDeleteDocumentTypesGroupFunction).nthCalledWith(1, { id: [props.group.id] })
})

test('calls notifySuccess with correct message in case successful deletion', async () => {
  jest.clearAllMocks()

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    group: mockDocumentTypesGroup,
    renderTrigger: MockContent,
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.DOC_TYPES_GROUP_SUCCESS_DELETION, { name: props.group.name }),
  )
})

test('calls notifySuccess with correct message in case successful deletion if group prop is not provided', async () => {
  jest.clearAllMocks()

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    renderTrigger: MockContent,
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.DOC_TYPES_GROUPS_SUCCESS_DELETION),
  )
})

test('calls onAfterDelete prop in case successful deletion if this prop is provided', async () => {
  jest.clearAllMocks()

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    renderTrigger: MockContent,
    onAfterDelete: jest.fn(),
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(props.onAfterDelete).toHaveBeenCalled()
})

test('calls notifyWarning with correct message in case of delete rejection', async () => {
  jest.clearAllMocks()

  const mockError = new Error('test')
  const mockRejectedUnwrapFn = () => Promise.reject(mockError)

  mockDeleteDocumentTypesGroupFunction.mockImplementationOnce(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    group: mockDocumentTypesGroup,
    renderTrigger: MockContent,
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

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
      code: 'prototype_has_document',
    },
  }

  const mockRejectedUnwrapFn = () => Promise.reject(mockError)

  mockDeleteDocumentTypesGroupFunction.mockImplementationOnce(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const props = {
    group: mockDocumentTypesGroup,
    renderTrigger: MockContent,
  }

  render(<DeleteDocumentTypesGroupButton {...props} />)

  await userEvent.click(screen.getByTestId('delete-trigger'))

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.PROTOTYPE_HAS_DOCUMENT_ERROR_MESSAGE),
  )
})
