
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { DocumentTypesGroup } from '@/models/DocumentTypesGroup'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { SetClassifiersDrawerButton } from './SetClassifiersDrawerButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useCreateGenAiClassifierMutation: jest.fn(() => ([
    mockCreateGenAiClassifier,
    { isLoading: false },
  ])),
}))

const mockCreateGenAiClassifier = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockOnTriggerClick = jest.fn()
const mockFormValues = 'mockFormValues'

const mockDocTypesGroup = new DocumentTypesGroup({
  id: 'id1',
  name: 'Group1',
  documentTypeIds: ['testType1', 'testType2'],
  createdAt: '2012-12-12',
  genAiClassifiers: [],
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

test('renders trigger button and drawer correctly', async () => {
  render(
    <SetClassifiersDrawerButton
      group={mockDocTypesGroup}
    />,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.SET_CLASSIFIERS),
  })
  const drawer = screen.getByTestId('drawer')

  expect(drawer).toBeInTheDocument()
  expect(button).toBeInTheDocument()

  await userEvent.click(button)

  expect(mockOnTriggerClick).toHaveBeenCalled()
})

test('calls create classifier api with correct args if onSubmit prop was called', async () => {
  render(
    <SetClassifiersDrawerButton
      group={mockDocTypesGroup}
    />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(mockCreateGenAiClassifier).nthCalledWith(1, mockFormValues)
})

test('calls success notification on successful classifier creation', async () => {
  jest.clearAllMocks()

  render(
    <SetClassifiersDrawerButton
      group={mockDocTypesGroup}
    />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifySuccess).nthCalledWith(
    1,
    localize(Localization.CREATE_GEN_AI_CLASSIFIER_SUCCESSFUL),
  )
})

test('calls notifyWarning if create classifier fails with known error', async () => {
  const errorCode = ErrorCode.forbidden
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockCreateGenAiClassifier.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(
    <SetClassifiersDrawerButton
      group={mockDocTypesGroup}
    />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[errorCode],
  )
})

test('calls notifyWarning if create classifier fails with unknown error', async () => {
  jest.clearAllMocks()

  mockCreateGenAiClassifier.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error())),
  }))

  render(
    <SetClassifiersDrawerButton
      group={mockDocTypesGroup}
    />,
  )

  const submitButton = screen.getByTestId('submit-btn')
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})
