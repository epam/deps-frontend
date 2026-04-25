
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { MAX_CONVERSATION_TITLE_LENGTH } from '../constants'
import { RenameConversationButton } from './RenameConversationButton'

const mockUpdateConversation = jest.fn(() => ({
  unwrap: jest.fn(),
}))

jest.mock('@/apiRTK/agenticAiApi', () => ({
  useUpdateConversationMutation: jest.fn(() => ([
    mockUpdateConversation,
    { isLoading: false },
  ])),
}))

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/components/TextEditorModal', () => ({
  TextEditorModal: ({
    maxLength,
    onCancel,
    onSubmit,
    value,
  }) => (
    <div>
      <input
        defaultValue={value}
        maxLength={maxLength}
      />
      <button
        data-testid={mockSubmitButtonId}
        onClick={() => onSubmit(newTitle)}
      />
      <button
        data-testid={mockCancelButtonId}
        onClick={onCancel}
      />
    </div>
  ),
}))

const mockRenderTrigger = ({ onClick }) => (
  <button
    data-testid='rename-trigger'
    onClick={onClick}
  />
)

const newTitle = 'New Title'
const mockSubmitButtonId = 'submit-button'
const mockCancelButtonId = 'cancel-button'

const defaultProps = {
  conversationId: 'conversation-id',
  conversationTitle: 'Conversation Title',
  onAfterClose: jest.fn(),
  onAfterRename: jest.fn(),
  renderTrigger: mockRenderTrigger,
}

test('shows content according renderTrigger prop', async () => {
  render(<RenameConversationButton {...defaultProps} />)

  expect(screen.getByTestId('rename-trigger')).toBeInTheDocument()
})

test('shows text editor on rename button click', async () => {
  render(<RenameConversationButton {...defaultProps} />)
  await userEvent.click(screen.getByTestId('rename-trigger'))

  const input = screen.getByRole('textbox')
  expect(input).toBeInTheDocument()
  expect(input).toHaveValue(defaultProps.conversationTitle)
})

test('passes MAX_CONVERSATION_TITLE_LENGTH as maxLength to TextEditorModal', async () => {
  render(<RenameConversationButton {...defaultProps} />)
  await userEvent.click(screen.getByTestId('rename-trigger'))

  const input = screen.getByRole('textbox')
  expect(input).toHaveAttribute('maxLength', MAX_CONVERSATION_TITLE_LENGTH.toString())
})

test('calls onAfterClose on Cancel button click', async () => {
  render(<RenameConversationButton {...defaultProps} />)
  await userEvent.click(screen.getByTestId('rename-trigger'))

  const cancelButton = screen.getByTestId(mockCancelButtonId)
  await userEvent.click(cancelButton)

  expect(defaultProps.onAfterClose).toHaveBeenCalled()
})

test('calls updateConversation with correct arguments on Submit button click', async () => {
  render(<RenameConversationButton {...defaultProps} />)
  await userEvent.click(screen.getByTestId('rename-trigger'))

  const submitButton = screen.getByTestId(mockSubmitButtonId)
  await userEvent.click(submitButton)

  expect(mockUpdateConversation).nthCalledWith(1, {
    conversationId: defaultProps.conversationId,
    data: {
      title: newTitle,
    },
  },
  )
})

test('calls notifySuccess, onAfterClose and onAfterRename props in case updating was successful', async () => {
  render(<RenameConversationButton {...defaultProps} />)
  await userEvent.click(screen.getByTestId('rename-trigger'))

  const submitButton = screen.getByTestId(mockSubmitButtonId)
  await userEvent.click(submitButton)

  expect(notifySuccess).nthCalledWith(1, localize(Localization.CONVERSATION_UPDATED))
  expect(defaultProps.onAfterClose).toHaveBeenCalled()
  expect(defaultProps.onAfterRename).nthCalledWith(1, newTitle)
})

test('calls notifyWarning with correct message in case updating has failed with known error', async () => {
  const errorCode = ErrorCode.alreadyExistsError
  const mockError = {
    data: {
      code: errorCode,
    },
  }

  mockUpdateConversation.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  }))

  render(<RenameConversationButton {...defaultProps} />)
  await userEvent.click(screen.getByTestId('rename-trigger'))

  const submitButton = screen.getByTestId(mockSubmitButtonId)
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    RESOURCE_ERROR_TO_DISPLAY[errorCode],
  )
})

test('calls notifyWarning with correct message in case updating has failed with unknown error', async () => {
  jest.clearAllMocks()

  mockUpdateConversation.mockImplementationOnce(() => ({
    unwrap: jest.fn(() => Promise.reject(new Error('Test'))),
  }))

  render(<RenameConversationButton {...defaultProps} />)
  await userEvent.click(screen.getByTestId('rename-trigger'))

  const submitButton = screen.getByTestId(mockSubmitButtonId)
  await userEvent.click(submitButton)

  expect(notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})
