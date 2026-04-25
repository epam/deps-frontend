
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { GenAiClassifier } from '@/models/DocumentTypesGroup'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { EditClassifierDrawerButton } from './EditClassifierDrawerButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useUpdateGenAiClassifierMutation: jest.fn(() => ([
    mockUpdateGenAiClassifier,
    { isLoading: false },
  ])),
}))

const mockUpdateGenAiClassifier = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockOnTriggerClick = jest.fn()
const mockFormValues = {
  llmType: 'gpt',
  name: 'name',
  prompt: 'prompt',
  genAiClassifierId: 'id',
}

const mockGenAiClassifier = new GenAiClassifier({
  genAiClassifierId: 'id',
  documentTypeId: 'mockDocTypeId1',
  name: 'Classifier Name',
  llmType: 'Test Classifier Llm',
  prompt: 'Test Classifier Prompt',
})

jest.mock('@/containers/GenAiClassifierDrawer', () => ({
  GenAiClassifierDrawer: ({ renderTrigger, onSubmit }) => (
    <>
      {renderTrigger(mockOnTriggerClick)}
      <div data-testid='drawer'>
        <button
          data-testid='submit-btn'
          onClick={() => onSubmit(mockFormValues)}
        />
      </div>
    </>
  ),
}))

jest.mock('@/components/Icons/PenIcon', () => ({
  PenIcon: () => <div data-testid={'edit-icon'} />,
}))

test('renders trigger button and drawer correctly', async () => {
  render(
    <EditClassifierDrawerButton
      classifier={mockGenAiClassifier}
    />,
  )

  const editClassifierButton = screen.getByTestId('edit-icon')
  const drawer = screen.getByTestId('drawer')

  expect(drawer).toBeInTheDocument()
  expect(editClassifierButton).toBeInTheDocument()

  await userEvent.click(editClassifierButton)

  expect(mockOnTriggerClick).toHaveBeenCalled()
})

test('calls update classifier api with correct args if onSubmit was called', async () => {
  render(
    <EditClassifierDrawerButton
      classifier={mockGenAiClassifier}
    />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(mockUpdateGenAiClassifier).nthCalledWith(1, mockFormValues)
})

test('calls success notification on successful classifier update', async () => {
  jest.clearAllMocks()

  render(
    <EditClassifierDrawerButton
      classifier={mockGenAiClassifier}
    />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.UPDATE_GEN_AI_CLASSIFIER_SUCCESSFUL),
  )
})

test('calls notifyWarning if update classifier fails with known error', async () => {
  const errorCode = ErrorCode.forbidden
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockUpdateGenAiClassifier.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <EditClassifierDrawerButton
      classifier={mockGenAiClassifier}
    />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[errorCode],
  )
})

test('calls notifyWarning if update classifier fails with unknown error', async () => {
  jest.clearAllMocks()

  mockUpdateGenAiClassifier.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error())),
  }))

  render(
    <EditClassifierDrawerButton
      classifier={mockGenAiClassifier}
    />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})
