
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { EditDocumentTypesGroupDrawerButton } from './EditDocumentTypesGroupDrawerButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useUpdateDocumentTypesGroupMutation: jest.fn(() => ([
    mockUpdateDocumentTypesGroupFn,
    { isLoading: false },
  ])),
}))

const mockUpdateDocumentTypesGroupFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockGroupId = 'groupId'
const updatedGroupName = 'New Group Name'

const mockDocumentTypesGroup = new DocumentTypesGroup({
  id: mockGroupId,
  name: 'Group Name',
  documentTypeIds: [],
})

const fillAndSaveDrawerFormValues = async () => {
  const editButton = screen.getByRole('button', { name: localize(Localization.EDIT) })
  await userEvent.click(editButton)

  const input = screen.getByPlaceholderText(localize(Localization.GROUP_PLACEHOLDER))
  await userEvent.clear(input)
  await userEvent.type(input, updatedGroupName)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  await userEvent.click(saveButton)
}

test('shows drawer on trigger click', async () => {
  render(
    <EditDocumentTypesGroupDrawerButton
      group={mockDocumentTypesGroup}
    />,
  )

  const editButton = screen.getByRole('button', { name: localize(Localization.EDIT) })
  await userEvent.click(editButton)

  const drawer = screen.getByTestId('drawer')
  const input = screen.getByPlaceholderText(localize(Localization.GROUP_PLACEHOLDER))

  expect(drawer).toBeInTheDocument()
  expect(drawer).toHaveTextContent(localize(Localization.EDIT_GROUP))
  expect(input).toBeInTheDocument()
})

test('renders disabled save button if form is invalid', async () => {
  render(
    <EditDocumentTypesGroupDrawerButton
      group={mockDocumentTypesGroup}
    />,
  )

  const editButton = screen.getByRole('button', { name: localize(Localization.EDIT) })
  await userEvent.click(editButton)

  const input = screen.getByPlaceholderText(localize(Localization.GROUP_PLACEHOLDER))
  await userEvent.clear(input)

  const saveButton = screen.getByRole('button', { name: localize(Localization.SAVE) })
  expect(saveButton).toBeDisabled()
})

test('calls updateDocumentTypesGroup when click on save button', async () => {
  render(
    <EditDocumentTypesGroupDrawerButton
      group={mockDocumentTypesGroup}
    />,
  )

  await fillAndSaveDrawerFormValues()

  await waitFor(() => {
    expect(mockUpdateDocumentTypesGroupFn).nthCalledWith(
      1,
      {
        groupId: mockGroupId,
        groupInfo: { name: updatedGroupName },
      },
    )
  })
})

test('calls success notification on successful document types group update', async () => {
  render(
    <EditDocumentTypesGroupDrawerButton
      group={mockDocumentTypesGroup}
    />,
  )

  await fillAndSaveDrawerFormValues()

  await waitFor(() => {
    expect(notifySuccess).nthCalledWith(
      1,
      localize(Localization.DOC_TYPES_GROUP_SUCCESS_UPDATE),
    )
  })
})

test('calls notifyWarning if updateDocumentTypesGroup fails with known error', async () => {
  const errorCode = ErrorCode.groupWithNameAlreadyExists
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockUpdateDocumentTypesGroupFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <EditDocumentTypesGroupDrawerButton
      group={mockDocumentTypesGroup}
    />,
  )

  await fillAndSaveDrawerFormValues()

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      RESOURCE_ERROR_TO_DISPLAY[errorCode],
    )
  })
})

test('calls notifyWarning if updateDocumentTypesGroup fails with unknown error', async () => {
  jest.clearAllMocks()

  mockUpdateDocumentTypesGroupFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error())),
  }))

  render(
    <EditDocumentTypesGroupDrawerButton
      group={mockDocumentTypesGroup}
    />,
  )

  await fillAndSaveDrawerFormValues()

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      localize(Localization.DEFAULT_ERROR),
    )
  })
})

test('update document types group if form is submitted with Enter key', async () => {
  render(
    <EditDocumentTypesGroupDrawerButton
      group={mockDocumentTypesGroup}
    />,
  )

  const editButton = screen.getByRole('button', { name: localize(Localization.EDIT) })
  await userEvent.click(editButton)

  const input = screen.getByPlaceholderText(localize(Localization.GROUP_PLACEHOLDER))
  await userEvent.clear(input)
  await userEvent.type(input, updatedGroupName)

  await userEvent.keyboard('{Enter}')

  await waitFor(() => {
    expect(mockUpdateDocumentTypesGroupFn).nthCalledWith(
      1,
      {
        groupId: mockGroupId,
        groupInfo: { name: updatedGroupName },
      },
    )
  })

  await waitFor(() => {
    expect(notifySuccess).nthCalledWith(
      1,
      localize(Localization.DOC_TYPES_GROUP_SUCCESS_UPDATE),
    )
  })
})
