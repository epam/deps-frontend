
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
import { AddDocumentTypesToGroupButton } from './AddDocumentTypesToGroupButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useAddDocumentTypesToGroupMutation: jest.fn(() => ([
    mockAddDocumentTypesToGroupFn,
    { isLoading: false },
  ])),
  useCreateGenAiClassifierMutation: jest.fn(() => ([
    mockCreateGenAiClassifierFn,
    { isLoading: false },
  ])),
}))

const mockAddDocumentTypesToGroupFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockCreateGenAiClassifierFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockGroupId = 'groupId'

const mockDocTypesGroup = new DocumentTypesGroup({
  id: mockGroupId,
  name: 'Group1',
  documentTypeIds: ['testType1', 'testType2'],
  createdAt: '2012-12-12',
  genAiClassifiers: [],
})

const mockAddDocTypesFormValues = {
  documentTypeIds: ['testType1', 'testType2'],
}

const mockAddClassifiersFormValues = {
  mockValues: 'mockValues',
}

jest.mock('@/containers/ManageGroupDocumentTypesDrawer', () => ({
  ManageGroupDocumentTypesDrawer: ({
    addClassifierToDocType,
    addDocTypesToGroup,
    visible,
  }) => (
    !!visible && (
      <div data-testid='drawer'>
        <button
          data-testid='add-doc-types-btn'
          onClick={() => addDocTypesToGroup(mockAddDocTypesFormValues)}
        />
        <button
          data-testid='add-classifier-btn'
          onClick={() => addClassifierToDocType(mockAddClassifiersFormValues)}
        />
      </div>
    )
  ),
}))

test('shows drawer on trigger click', async () => {
  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const drawer = screen.getByTestId('drawer')

  expect(drawer).toBeInTheDocument()
})

test('calls addDocumentTypesToGroup with correct args on save button click', async () => {
  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const saveButton = screen.getByTestId('add-doc-types-btn')
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(mockAddDocumentTypesToGroupFn).nthCalledWith(
      1,
      {
        groupId: mockGroupId,
        documentTypeIds: mockAddDocTypesFormValues.documentTypeIds,
      },
    )
  })
})

test('calls success notification on successful document types group creation', async () => {
  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const saveButton = screen.getByTestId('add-doc-types-btn')
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(notifySuccess).nthCalledWith(
      1,
      localize(Localization.ADD_DOC_TYPE_TO_GROUP_SUCCESS),
    )
  })
})

test('calls notifyWarning if addDocumentTypesToGroup fails with known error', async () => {
  const errorCode = ErrorCode.documentTypesNotFound
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockAddDocumentTypesToGroupFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const saveButton = screen.getByTestId('add-doc-types-btn')
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      RESOURCE_ERROR_TO_DISPLAY[errorCode],
    )
  })
})

test('calls notifyWarning if addDocumentTypesToGroup fails with unknown error', async () => {
  jest.clearAllMocks()

  mockAddDocumentTypesToGroupFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error())),
  }))

  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const saveButton = screen.getByTestId('add-doc-types-btn')
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      localize(Localization.DEFAULT_ERROR),
    )
  })
})

test('calls createGenAiClassifier with correct args on save button click', async () => {
  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const saveButton = screen.getByTestId('add-classifier-btn')
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(mockCreateGenAiClassifierFn).nthCalledWith(
      1,
      mockAddClassifiersFormValues,
    )
  })
})

test('calls success notification on successful classifier creation', async () => {
  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const saveButton = screen.getByTestId('add-classifier-btn')
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(notifySuccess).nthCalledWith(
      1,
      localize(Localization.CREATE_GEN_AI_CLASSIFIER_SUCCESSFUL),
    )
  })
})

test('calls notifyWarning if createGenAiClassifier fails with known error', async () => {
  jest.clearAllMocks()

  const errorCode = ErrorCode.alreadyExistException
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockCreateGenAiClassifierFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const saveButton = screen.getByTestId('add-classifier-btn')
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      RESOURCE_ERROR_TO_DISPLAY[errorCode],
    )
  })
})

test('calls notifyWarning if createGenAiClassifier fails with unknown error', async () => {
  jest.clearAllMocks()

  mockCreateGenAiClassifierFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error())),
  }))

  render(
    <AddDocumentTypesToGroupButton
      group={mockDocTypesGroup}
    />,
  )

  const addButton = screen.getByRole('button', { name: localize(Localization.ADD_DOC_TYPE) })
  await userEvent.click(addButton)

  const saveButton = screen.getByTestId('add-classifier-btn')
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(notifyWarning).nthCalledWith(
      1,
      localize(Localization.DEFAULT_ERROR),
    )
  })
})
