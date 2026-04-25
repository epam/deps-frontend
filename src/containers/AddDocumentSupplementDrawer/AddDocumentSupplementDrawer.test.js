
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { FieldType } from '@/enums/FieldType'
import { StatusCode } from '@/enums/StatusCode'
import { Localization, localize } from '@/localization/i18n'
import { DocumentSupplement } from '@/models/DocumentSupplement'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { AddDocumentSupplementDrawer } from './AddDocumentSupplementDrawer'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

const mockDocumentSupplement = new DocumentSupplement({
  name: '',
  type: FieldType.STRING,
  code: '12345',
  value: 'Mock Value',
})

const mockPrompt = 'mockPrompt'

const mockCreateOrUpdateSupplementsFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockRefetchSupplementsFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve([])),
}))

jest.mock('@/apiRTK/documentSupplementsApi', () => ({
  useCreateOrUpdateSupplementsMutation: jest.fn(() => ([
    mockCreateOrUpdateSupplementsFn,
    { isLoading: false },
  ])),
  useLazyFetchSupplementsQuery: jest.fn(() => ([
    mockRefetchSupplementsFn,
    { isFetching: false },
  ])),
}))

const mockDocumentId = 'mockId'
const mockDocumentTypeCode = 'mockDocumentTypeCode'

test('closes the drawer on cancel button click', async () => {
  const toggleDrawer = jest.fn()

  render(
    <AddDocumentSupplementDrawer
      documentId={mockDocumentId}
      documentTypeCode={mockDocumentTypeCode}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      isDrawerVisible={true}
      toggleDrawer={toggleDrawer}
    />,
  )

  await userEvent.click(screen.getByText(localize(Localization.CANCEL)))

  expect(toggleDrawer).toHaveBeenCalled()
})

test('disables submit button if name field is empty', async () => {
  render(
    <AddDocumentSupplementDrawer
      documentId={mockDocumentId}
      documentTypeCode={mockDocumentTypeCode}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      isDrawerVisible={true}
      toggleDrawer={jest.fn()}
    />,
  )

  const submitBtn = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  await waitFor(() => {
    expect(submitBtn).toBeDisabled()
  })
})

test('adds new supplement and close drawer on submit button click', async () => {
  const toggleDrawer = jest.fn()

  render(
    <AddDocumentSupplementDrawer
      documentId={mockDocumentId}
      documentTypeCode={mockDocumentTypeCode}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      isDrawerVisible={true}
      toggleDrawer={toggleDrawer}
    />,
  )

  const setPromptButton = screen.getByRole('button', {
    name: localize(Localization.SET_PROMPT),
  })

  await userEvent.click(setPromptButton)

  const submitBtn = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  await userEvent.click(submitBtn)

  expect(mockRefetchSupplementsFn).toHaveBeenCalled()

  expect(mockCreateOrUpdateSupplementsFn).nthCalledWith(
    1,
    {
      documentId: mockDocumentId,
      documentTypeId: mockDocumentTypeCode,
      data: [{
        name: mockPrompt,
        value: mockDocumentSupplement.value,
      }],
    },
  )

  expect(toggleDrawer).toHaveBeenCalled()

  expect(notifySuccess).toHaveBeenCalledWith(localize(Localization.FIELD_CREATION_SUCCESS_MESSAGE))
})

test('shows correct warning message if adding fails with unknown error code', async () => {
  jest.clearAllMocks()

  const mockError = new Error('')
  mockCreateOrUpdateSupplementsFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <AddDocumentSupplementDrawer
      documentId={mockDocumentId}
      documentTypeCode={mockDocumentTypeCode}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      isDrawerVisible={true}
      toggleDrawer={jest.fn()}
    />,
  )

  const setPromptButton = screen.getByRole('button', {
    name: localize(Localization.SET_PROMPT),
  })

  await userEvent.click(setPromptButton)

  const submitBtn = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  await userEvent.click(submitBtn)

  expect(notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
})

test('shows correct warning message if adding fails with known error code', async () => {
  jest.clearAllMocks()

  const errorCode = 'already_exists_error'
  const mockError = {
    response: {
      data: {
        code: errorCode,
      },
    },
  }
  mockCreateOrUpdateSupplementsFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <AddDocumentSupplementDrawer
      documentId={mockDocumentId}
      documentTypeCode={mockDocumentTypeCode}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      isDrawerVisible={true}
      toggleDrawer={jest.fn()}
    />,
  )

  const setPromptButton = screen.getByRole('button', {
    name: localize(Localization.SET_PROMPT),
  })

  await userEvent.click(setPromptButton)

  const submitBtn = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  await userEvent.click(submitBtn)

  expect(notifyWarning).toHaveBeenCalledWith(RESOURCE_ERROR_TO_DISPLAY[errorCode])
})

test('adds new supplement if form was submitted with enter keyboard click', async () => {
  jest.clearAllMocks()

  const mockToggleDrawer = jest.fn()

  render(
    <AddDocumentSupplementDrawer
      documentId={mockDocumentId}
      documentTypeCode={mockDocumentTypeCode}
      field={mockDocumentSupplement}
      isDrawerVisible={true}
      toggleDrawer={mockToggleDrawer}
    />,
  )

  const nameInput = screen.getByPlaceholderText(localize(Localization.NAME_PLACEHOLDER))
  const mockName = 'mockName'

  await userEvent.type(nameInput, `${mockName}{enter}`)

  expect(mockCreateOrUpdateSupplementsFn).nthCalledWith(
    1,
    {
      documentId: mockDocumentId,
      documentTypeId: mockDocumentTypeCode,
      data: [{
        name: mockName,
        value: mockDocumentSupplement.value,
      }],
    },
  )

  expect(mockToggleDrawer).toHaveBeenCalled()

  expect(notifySuccess).toHaveBeenCalledWith(localize(Localization.FIELD_CREATION_SUCCESS_MESSAGE))
})

test('does not show warning message if fetching supplements failed and status code 404', async () => {
  jest.clearAllMocks()

  const error = {
    status: StatusCode.NOT_FOUND,
  }

  mockRefetchSupplementsFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(error)),
  }))

  render(
    <AddDocumentSupplementDrawer
      documentId={mockDocumentId}
      documentTypeCode={mockDocumentTypeCode}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      isDrawerVisible={true}
      toggleDrawer={jest.fn()}
    />,
  )

  const setPromptButton = screen.getByRole('button', {
    name: localize(Localization.SET_PROMPT),
  })

  await userEvent.click(setPromptButton)

  const submitBtn = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  await userEvent.click(submitBtn)

  expect(notifyWarning).not.toHaveBeenCalled()
})

test('shows warning message if fetching supplements failed and status code is not 404', async () => {
  jest.clearAllMocks()

  const error = new Error('')

  mockRefetchSupplementsFn.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(error)),
  }))

  render(
    <AddDocumentSupplementDrawer
      documentId={mockDocumentId}
      documentTypeCode={mockDocumentTypeCode}
      field={mockDocumentSupplement}
      genAiPrompt={mockPrompt}
      isDrawerVisible={true}
      toggleDrawer={jest.fn()}
    />,
  )

  const setPromptButton = screen.getByRole('button', {
    name: localize(Localization.SET_PROMPT),
  })

  await userEvent.click(setPromptButton)

  const submitBtn = screen.getByRole('button', {
    name: localize(Localization.SUBMIT),
  })

  await userEvent.click(submitBtn)

  expect(notifyWarning).nthCalledWith(1, localize(Localization.DEFAULT_ERROR))
})
