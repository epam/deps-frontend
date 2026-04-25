
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {
  storeChatDialogs,
  removeChatDialogs,
} from '@/actions/agenticChat'
import { useFetchConversationQuery } from '@/apiRTK/agenticAiApi'
import { Localization, localize } from '@/localization/i18n'
import {
  AgenticChatCompletion,
  AgenticChatDialogMessage,
  AgenticChatDialog,
  AgenticConversation,
} from '@/models/AgenticChat'
import { selectAgenticChatByConversationId } from '@/selectors/agenticChat'
import { documentSelector } from '@/selectors/documentReviewPage'
import { notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { Conversation } from './Conversation'

jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')

jest.mock('dayjs', () => () => ({
  format: () => mockTime,
}))

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/agenticChat', () => ({
  storeChatDialogs: jest.fn(() => 'storeChatDialogs'),
  removeChatDialogs: jest.fn(() => 'removeChatDialogs'),
}))

jest.mock('@/apiRTK/agenticAiApi', () => ({
  useFetchConversationQuery: jest.fn(() => ({
    data: mockConversation,
    isFetching: false,
    isError: false,
  })),
}))

jest.mock('@/selectors/agenticChat', () => ({
  selectAgenticChatByConversationId: jest.fn(() => () => mockDialog),
}))

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useUpdateQuestion: (...args) => mockUseUpdateQuestion(...args),
}))

jest.mock('./Conversation.styles', () => {
  const { forwardRef } = require('react')

  return ({
    EmptyChatImage: jest.fn(() => <div data-testid={'empty-chat-image'} />),
    Wrapper: forwardRef(({ children }, ref) => (
      <div
        ref={ref}
        data-testid='wrapper'
      >
        {children}
      </div>
    )),
  })
})

jest.mock('@/containers/AiAnswer', () => ({
  AiAnswer: ({ allowSave, answer, time }) => (
    <div>
      <span>{answer}</span>
      <span>{time}</span>
      {allowSave && <button data-testid='save-to-field-button' />}
    </div>
  ),
}))

jest.mock('@/containers/UserPrompt', () => ({
  UserPrompt: ({ message, time, onEdit }) => (
    <div>
      <span>{message}</span>
      <span>{time}</span>
      <button
        data-testid="edit-question"
        onClick={onEdit}
      />
    </div>
  ),
}))

jest.mock('../ChatInput', () => ({
  ChatInput: ({ prompt, saveDialog, setPrompt, onCancel }) => (
    <>
      <input
        data-testid="chat-input"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <button
        data-testid="send-btn"
        onClick={() => saveDialog()}
      />
      <button
        data-testid="close-btn"
        onClick={() => onCancel()}
      />
    </>
  ),
}))

jest.mock('../ThinkingMessage', () => ({
  ThinkingMessage: () => (
    <div data-testid='thinking-message' />
  ),
}))

const mockUseUpdateQuestion = jest.fn()
const mockSetEditingMode = jest.fn()
const mockResetEditingMode = jest.fn()
const mockSaveEditedQuestion = jest.fn()
const mockSetUpdatedQuestion = jest.fn()
const mockDispatch = jest.fn()
const mockConversationId = 'conversationId'
const mockTime = '11:20'
const dialogPrompt = 'prompt'
const dialogQuestion = new AgenticChatDialogMessage('11:10', dialogPrompt)
const dialogAnswer = new AgenticChatDialogMessage('11:20', 'answer')
const updatedPrompt = 'updated prompt'
const mockDocument = documentSelector.getSelectorMockValue()

const mockCompletion = new AgenticChatCompletion({
  id: 'completionId',
  question: new AgenticChatDialogMessage('11:00', 'question text'),
  answer: new AgenticChatDialogMessage('11:00', 'answer text'),
})

const mockCompletion2 = new AgenticChatCompletion({
  id: 'completionId2',
  question: new AgenticChatDialogMessage('11:00', 'question text - 2'),
  answer: new AgenticChatDialogMessage('11:00', 'answer text - 2'),
})

const mockConversation = new AgenticConversation({
  id: mockConversationId,
  title: 'Test Conversation Title',
  completions: [mockCompletion, mockCompletion2],
  relation: {
    details: {
      documentId: mockDocument._id,
    },
  },
})

const mockDialog = [
  new AgenticChatDialog({
    id: mockCompletion.id,
    conversationId: mockConversationId,
    question: dialogQuestion,
    answer: dialogAnswer,
  }),
]

const mockRef = React.createRef()

beforeEach(() => {
  jest.clearAllMocks()
  mockUseUpdateQuestion.mockReturnValue({
    editedCompletionId: null,
    updatedQuestion: '',
    setEditingMode: mockSetEditingMode,
    resetEditingMode: mockResetEditingMode,
    saveEditedQuestion: mockSaveEditedQuestion,
    setUpdatedQuestion: mockSetUpdatedQuestion,
  })
})

test('shows loading spinner when fetching', () => {
  useFetchConversationQuery.mockImplementationOnce(() => ({
    data: null,
    isFetching: true,
    isError: false,
  }))

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  expect(screen.getByTestId('spin')).toBeInTheDocument()
})

test('shows notification message in case of conversations fetching failure', () => {
  useFetchConversationQuery.mockImplementationOnce(() => ({
    data: null,
    isFetching: false,
    isError: true,
  }))

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  expect(notifyWarning).nthCalledWith(1, localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE))
})

test('calls dispatch with storeChatDialogs if fetched conversation has completions', async () => {
  jest.clearAllMocks()

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  const expectedResult = [
    new AgenticChatDialog({
      id: mockCompletion.id,
      conversationId: mockConversationId,
      question: mockCompletion.question,
      answer: mockCompletion.answer,
    }),
  ]

  expect(mockDispatch).nthCalledWith(1, storeChatDialogs(expectedResult))
})

test('renders dialog', () => {
  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  expect(screen.getByText(dialogQuestion.text)).toBeInTheDocument()
  expect(screen.getByText(dialogQuestion.createdAt)).toBeInTheDocument()
  expect(screen.getByText(dialogAnswer.text)).toBeInTheDocument()
  expect(screen.getByText(dialogAnswer.createdAt)).toBeInTheDocument()
  expect(screen.getByTestId('save-to-field-button')).toBeInTheDocument()
})

test('renders dialog and thinking message when isCompletionProcessing is true', () => {
  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={true}
    />,
  )

  expect(screen.getByText(dialogQuestion.text)).toBeInTheDocument()
  expect(screen.getByText(dialogQuestion.createdAt)).toBeInTheDocument()
  expect(screen.getByText(dialogAnswer.text)).toBeInTheDocument()
  expect(screen.getByText(dialogAnswer.createdAt)).toBeInTheDocument()
  expect(screen.getByTestId('thinking-message')).toBeInTheDocument()
})

test('renders EmptyImage if dialog is empty', () => {
  selectAgenticChatByConversationId.mockImplementationOnce(() => () => [])

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  expect(screen.getByTestId('empty-chat-image')).toBeInTheDocument()
})

test('renders thinking message when dialog is empty but isCompletionProcessing is true', () => {
  selectAgenticChatByConversationId.mockImplementationOnce(() => () => [])

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={true}
    />,
  )

  expect(screen.queryByTestId('empty-chat-image')).not.toBeInTheDocument()
  expect(screen.getByTestId('thinking-message')).toBeInTheDocument()
})

test('uses containerRef correctly', () => {
  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  const wrapper = screen.getByTestId('wrapper')
  expect(mockRef.current).toBe(wrapper)
})

test('clears dialogs and reset editing mode on unmount', async () => {
  const { unmount } = render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  jest.clearAllMocks()

  unmount()
  expect(mockDispatch).nthCalledWith(1, removeChatDialogs(mockConversationId))
  expect(mockResetEditingMode).toHaveBeenCalled()
})

test('calls setEditingMode with correct arguments if question edit button was clicked', async () => {
  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  const editBtn = screen.getByTestId('edit-question')
  await userEvent.click(editBtn)

  expect(mockSetEditingMode).nthCalledWith(1, mockCompletion.id, dialogPrompt)
})

test('renders chat input with passed updatedQuestion if completion is edited and calls setUpdatedQuestion on new prompt type', async () => {
  mockUseUpdateQuestion.mockReturnValue({
    editedCompletionId: mockCompletion.id,
    updatedQuestion: updatedPrompt,
    resetEditingMode: mockResetEditingMode,
    setUpdatedQuestion: mockSetUpdatedQuestion,
  })

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  const input = screen.getByTestId('chat-input')
  expect(input).toBeInTheDocument()
  expect(input).toHaveValue(updatedPrompt)

  await userEvent.type(input, '1')
  expect(mockSetUpdatedQuestion).nthCalledWith(1, `${updatedPrompt}1`)
})

test('calls saveEditedQuestion with correct arguments on edited message send', async () => {
  mockUseUpdateQuestion.mockReturnValue({
    editedCompletionId: mockCompletion.id,
    updatedQuestion: updatedPrompt,
    resetEditingMode: mockResetEditingMode,
    saveEditedQuestion: mockSaveEditedQuestion,
  })

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  await userEvent.click(screen.getByTestId('send-btn'))
  expect(mockSaveEditedQuestion).nthCalledWith(1, mockCompletion.id)
})

test('calls resetEditingMode if message editing was canceled', async () => {
  mockUseUpdateQuestion.mockReturnValue({
    editedCompletionId: mockCompletion.id,
    updatedQuestion: updatedPrompt,
    resetEditingMode: mockResetEditingMode,
  })

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  await userEvent.click(screen.getByTestId('close-btn'))
  expect(mockResetEditingMode).toHaveBeenCalled()
})

test('does not show save to field button for answer for conversation from different document', async () => {
  documentSelector.mockImplementationOnce(() => ({
    ...documentSelector.getSelectorMockValue(),
    _id: 'otherDocumentId',
  }))

  render(
    <Conversation
      containerRef={mockRef}
      conversationId={mockConversationId}
      editMessage={jest.fn()}
      isCompletionProcessing={false}
    />,
  )

  expect(screen.queryByTestId('save-to-field-button')).not.toBeInTheDocument()
})
