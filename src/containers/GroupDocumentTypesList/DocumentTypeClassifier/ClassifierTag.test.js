
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { GenAiClassifier } from '@/models/DocumentTypesGroup'
import { render } from '@/utils/rendererRTL'
import { ClassifierTag } from './ClassifierTag'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/components/Icons/XMarkIcon', () => ({
  XMarkIcon: () => <div data-testid='delete-icon' />,
}))

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useDeleteGenAiClassifierMutation: jest.fn(() => (
    [mockDeleteClassifier]),
  ),
}))

const deleteClassifierUnwrappedFn = jest.fn(() => Promise.resolve())
const mockDeleteClassifier = jest.fn(() => ({
  unwrap: deleteClassifierUnwrappedFn,
}))

Modal.confirm = jest.fn()

const mockGenAiClassifier = new GenAiClassifier({
  genAiClassifierId: 'genAiClassifierId',
  documentTypeId: 'mockDocumentTypeId',
  name: 'Classifier Name',
  llmType: 'Test Classifier Llm',
  prompt: 'Test Classifier Prompt',
})

test('shows classifier name', async () => {
  render(
    <ClassifierTag
      classifier={mockGenAiClassifier}
    />,
  )

  expect(screen.getByText(mockGenAiClassifier.name)).toBeInTheDocument()
})

test('calls Modal.confirm with correct arguments in case of remove classifier icon click', async () => {
  render(
    <ClassifierTag
      classifier={mockGenAiClassifier}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-icon'))

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_CLASSIFIER_CONFIRM_MESSAGE, {
      name: mockGenAiClassifier.name,
    }),
    onOk: expect.any(Function),
  })
})

test('calls deleteGenAiClassifier with correct argument when clicking on modal confirm', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <ClassifierTag
      classifier={mockGenAiClassifier}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-icon'))

  expect(mockDeleteClassifier).nthCalledWith(1, [mockGenAiClassifier.genAiClassifierId])
})

test('calls notifySuccess with correct message in case successful classifier deletion', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <ClassifierTag
      classifier={mockGenAiClassifier}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-icon'))

  expect(mockNotification.notifySuccess).nthCalledWith(
    1,
    localize(Localization.CLASSIFIER_SUCCESS_DELETION, {
      name: mockGenAiClassifier.name,
    }),
  )
})

test('calls notifyWarning with correct message in case delete fails with unknown error code', async () => {
  jest.clearAllMocks()

  const mockError = new Error('test')

  mockDeleteClassifier.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <ClassifierTag
      classifier={mockGenAiClassifier}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-icon'))

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('calls notifyWarning with correct message in case delete fails with known code', async () => {
  jest.clearAllMocks()

  const mockError = {
    data: {
      code: ErrorCode.illegal_argument,
    },
  }

  mockDeleteClassifier.mockImplementationOnce(() => ({
    unwrap: () => Promise.reject(mockError),
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  render(
    <ClassifierTag
      classifier={mockGenAiClassifier}
    />,
  )

  await userEvent.click(screen.getByTestId('delete-icon'))

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[ErrorCode.illegal_argument],
  )
})
