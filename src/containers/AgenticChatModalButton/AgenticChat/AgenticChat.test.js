
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { storeChatDialog } from '@/actions/agenticChat'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { AgenticAiParameters } from '@/enums/AgenticAiParameters'
import {
  ConversationsListItem,
  Mode,
  Tool,
  ToolParameter,
  ToolSet,
} from '@/models/AgenticChat'
import { documentSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { AgenticChat } from './AgenticChat'

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
  storeChatDialog: jest.fn(() => 'storeChatDialog'),
}))

jest.mock('@/apiRTK/agenticAiApi', () => ({
  useLazyFetchConversationQuery: jest.fn(() => ([mockRefetchConversationFn])),
}))

const mockUseAgenticChatData = jest.fn()
const mockUseChatSettings = jest.fn()
const mockUseConversationManager = jest.fn()
const mockCreateConversation = jest.fn()
const mockStartNewConversation = jest.fn()
const mockSetInitialTitle = jest.fn()
const mockUseAgenticChatStream = jest.fn()
const mockCreateContext = jest.fn(() => mockContext)
const mockCreateCompletion = jest.fn(({ onCompletionCreation, onFinal }) => {
  onCompletionCreation()
  onFinal()
})
const mockEditCompletion = jest.fn(({ onFinal }) => {
  onFinal()
})
const mockRefetchConversationFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve([])),
}))

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useAgenticChatData: (...args) => mockUseAgenticChatData(...args),
  useChatSettings: () => mockUseChatSettings(),
  useConversationManager: (...args) => mockUseConversationManager(...args),
  useAgenticChatStream: () => mockUseAgenticChatStream(),
}))

jest.mock('../ChatHeaderBase', () => ({
  ChatHeaderBase: () => <div data-testid="chat-header-base" />,
}))

jest.mock('../ChatHeaderExpanded', () => ({
  ChatHeaderExpanded: () => <div data-testid="chat-header-expanded" />,
}))

jest.mock('../ConversationsSidebar', () => ({
  ConversationsSidebar: () => <div data-testid="conversations-sidebar" />,
}))

jest.mock('../ChatContent', () => ({
  ChatContent: ({ onSuggestedPromptClick, editMessage }) => (
    <>
      <div data-testid="chat-content">
        <button
          data-testid="suggested-prompt"
          onClick={onSuggestedPromptClick}
        />
      </div>
      <button
        data-testid="edit-question"
        onClick={() => editMessage(mockCompletionId, newPrompt)}
      />
    </>
  ),
}))

jest.mock('../ChatFooter', () => ({
  ChatFooter: ({ prompt, setPrompt, onSendMessage, disabled }) => (
    <div data-testid="chat-footer">
      <input
        data-testid="chat-input"
        disabled={disabled}
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <button
        data-testid="send-btn"
        onClick={() => onSendMessage()}
      />
    </div>
  ),
}))

const mockDispatch = jest.fn()
const newPrompt = 'new prompt'
const mockTime = '11:20'
const mockDocument = documentSelector.getSelectorMockValue()
const mockDifferentDocumentId = 'different-document-id'
const mockActiveAgentVendorId = 'agentId'
const mockContext = { parameter: 'value' }
const mockCompletionId = 'completionId'

const mockConversation = new ConversationsListItem({
  id: 'id1',
  agentVendorId: 'agentId',
  mode: {
    id: 'modeId',
    code: AgenticAiModes.DOCUMENT,
  },
  title: 'Conversation 1 Title',
  relation: {
    details: {
      documentId: mockDocument._id,
    },
  },
})

const mockConversationFromDifferentDocument = new ConversationsListItem({
  id: 'differentDocConversationId',
  title: 'Different Doc Conversation',
  agentVendorId: 'agentId',
  mode: {
    id: 'modeId',
    code: AgenticAiModes.DOCUMENT,
  },
  relation: {
    details: {
      documentId: mockDifferentDocumentId,
    },
  },
})

const mockToolSet = new ToolSet({
  id: 'id',
  code: 'toolSetCode1',
  name: 'ToolSet 1',
  tools: [
    new Tool({
      code: 'mockTool2',
      name: 'Tool 2',
      parameters: [
        new ToolParameter({ name: AgenticAiParameters.DOCUMENT_TYPE_ID },
        )],
    }),
  ],
})

const mockMode = new Mode({
  code: AgenticAiModes.DOCUMENT,
  id: 'mockId',
  toolSets: [mockToolSet],
})

const defaultConversations = {
  [mockDocument._id]: [mockConversation],
  mockDifferentDocumentId: [mockConversationFromDifferentDocument],
}

beforeEach(() => {
  jest.clearAllMocks()
  mockUseAgenticChatData.mockReturnValue({
    activeAgentVendorId: mockActiveAgentVendorId,
    conversations: defaultConversations,
    modes: [mockMode],
    isFetching: false,
    isError: false,
  })
  mockUseChatSettings.mockReturnValue({
    isExpandedView: false,
    activeConversationId: mockConversation.id,
    activeDocumentData: { documentId: mockDocument._id },
    createContextForSelectedTools: mockCreateContext,
    createContextForAllTools: mockCreateContext,
  })
  mockUseAgenticChatStream.mockReturnValue({
    createCompletion: mockCreateCompletion,
    editCompletion: mockEditCompletion,
    isCompletionProcessing: false,
  })
  mockUseConversationManager.mockReturnValue({
    initialTitle: '',
    isCreating: false,
    startNewConversation: mockStartNewConversation,
    createConversation: mockCreateConversation,
    setInitialTitle: mockSetInitialTitle,
  })
})

test('shows loading spinner when fetching', () => {
  mockUseAgenticChatData.mockReturnValueOnce({
    conversations: [],
    activeAgentVendorId: null,
    modes: null,
    isFetching: true,
    isError: false,
  })

  render(<AgenticChat />)

  const spinners = screen.getAllByTestId('spin')
  expect(spinners.length).toBeGreaterThan(0)
})

test('renders ChatHeaderBase in base view', () => {
  render(<AgenticChat />)

  expect(screen.getByTestId('chat-header-base')).toBeInTheDocument()
  expect(screen.queryByTestId('chat-header-expanded')).not.toBeInTheDocument()
  expect(screen.queryByTestId('conversations-sidebar')).not.toBeInTheDocument()
})

test('renders ChatHeaderExpanded and ConversationsSidebar in expanded view', () => {
  mockUseChatSettings.mockReturnValue({
    isExpandedView: true,
    activeConversationId: null,
  })

  render(<AgenticChat />)

  expect(screen.getByTestId('chat-header-expanded')).toBeInTheDocument()
  expect(screen.getByTestId('conversations-sidebar')).toBeInTheDocument()
  expect(screen.queryByTestId('chat-header-base')).not.toBeInTheDocument()
})

test('renders ChatContent and ChatFooter', () => {
  render(<AgenticChat />)

  expect(screen.getByTestId('chat-content')).toBeInTheDocument()
  expect(screen.getByTestId('chat-footer')).toBeInTheDocument()
})

test('hides ChatFooter when conversation is from different document', () => {
  mockUseChatSettings.mockReturnValue({
    isExpandedView: false,
    activeConversationId: mockConversationFromDifferentDocument.id,
    activeDocumentData: { documentId: mockDifferentDocumentId },
  })

  render(<AgenticChat />)

  expect(screen.getByTestId('chat-content')).toBeInTheDocument()
  expect(screen.queryByTestId('chat-footer')).not.toBeInTheDocument()
})

test('calls createCompletion, refetch conversation and clears prompt after saving on message send', async () => {
  render(<AgenticChat />)

  const input = screen.getByTestId('chat-input')
  const sendBtn = screen.getByTestId('send-btn')

  await userEvent.type(input, newPrompt)
  expect(input.value).toBe(newPrompt)

  await userEvent.click(sendBtn)
  expect(input.value).toBe('')

  expect(mockCreateCompletion).nthCalledWith(1, {
    conversationId: mockConversation.id,
    userQuestion: newPrompt,
    chatArguments: mockContext,
    onCompletionCreation: expect.any(Function),
    onFinal: expect.any(Function),
  })

  expect(mockRefetchConversationFn).nthCalledWith(1, {
    conversationId: mockConversation.id,
  })
})

test('dispatches storeChatDialog with correct prompt on message send', async () => {
  render(<AgenticChat />)

  const input = screen.getByTestId('chat-input')
  const sendBtn = screen.getByTestId('send-btn')

  await userEvent.type(input, newPrompt)
  expect(input.value).toBe(newPrompt)

  await userEvent.click(sendBtn)
  expect(mockDispatch).nthCalledWith(1, storeChatDialog())

  const [dialogArg] = storeChatDialog.mock.calls[0]
  expect(dialogArg.conversationId).toBe(mockConversation.id)
  expect(dialogArg.question.text).toBe(newPrompt)
  expect(dialogArg.question.createdAt).toBe(mockTime)
})

test('does not call dispatch storeChatDialog if prompt is empty', async () => {
  render(<AgenticChat />)

  const input = screen.getByTestId('chat-input')
  const sendBtn = screen.getByTestId('send-btn')
  expect(input.value).toBe('')

  await userEvent.click(sendBtn)
  expect(mockDispatch).not.toHaveBeenCalled()
})

test('creates new conversation when no conversation is active', async () => {
  const newConversationId = 'new-conversation-id'
  mockCreateConversation.mockImplementationOnce(jest.fn(() => Promise.resolve(newConversationId)))

  mockUseAgenticChatData.mockReturnValue({
    conversations: { items: [] },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: [mockMode],
    isFetching: false,
    isError: false,
  })
  mockUseChatSettings.mockReturnValue({
    activeConversationId: null,
    createContextForSelectedTools: mockCreateContext,
    createContextForAllTools: mockCreateContext,
  })

  const user = userEvent.setup()

  render(<AgenticChat />)

  const input = screen.getByTestId('chat-input')
  await user.type(input, newPrompt)
  await user.click(screen.getByTestId('send-btn'))

  await waitFor(() => expect(mockCreateConversation).toHaveBeenCalled())

  expect(mockCreateCompletion).toHaveBeenCalledWith({
    conversationId: newConversationId,
    userQuestion: newPrompt,
    chatArguments: mockContext,
    onCompletionCreation: expect.any(Function),
    onFinal: expect.any(Function),
  })

  await waitFor(() => expect(storeChatDialog).toHaveBeenCalled())

  const [dialogQuestion] = storeChatDialog.mock.calls
  expect(dialogQuestion[0].conversationId).toBe(newConversationId)
})

test('selecting a suggested prompt triggers save flow', async () => {
  const newConversationId = 'new-conversation-id'
  mockCreateConversation.mockImplementationOnce(jest.fn(() => Promise.resolve(newConversationId)))

  mockUseAgenticChatData.mockReturnValue({
    conversations: { items: [] },
    agentVendorId: mockActiveAgentVendorId,
    modes: [mockMode],
    isFetching: false,
    isError: false,
  })
  mockUseChatSettings.mockReturnValue({
    isExpandedView: false,
    activeConversationId: null,
    createContextForSelectedTools: mockCreateContext,
    createContextForAllTools: mockCreateContext,
  })
  const user = userEvent.setup()

  render(<AgenticChat />)

  await user.click(screen.getByTestId('suggested-prompt'))

  await waitFor(() => expect(mockCreateConversation).toHaveBeenCalled())
  await waitFor(() => expect(mockDispatch).toHaveBeenCalled())
})

test('shows loading spinner while conversation creating', () => {
  mockUseConversationManager.mockReturnValue({
    initialTitle: '',
    isCreating: true,
    startNewConversation: mockStartNewConversation,
    createConversation: jest.fn(() => Promise.resolve(mockConversation.id)),
    setInitialTitle: mockSetInitialTitle,
  })

  render(<AgenticChat />)

  const spinners = screen.getAllByTestId('spin')
  expect(spinners.length).toBeGreaterThan(0)
})

test('passes user prompt to createConversation', async () => {
  const newConversationId = 'new-conversation-id'
  const prompt = 'This is a prompt'
  mockCreateConversation.mockImplementationOnce(jest.fn(() => Promise.resolve(newConversationId)))

  mockUseAgenticChatData.mockReturnValue({
    conversations: { items: [] },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: [mockMode],
    isFetching: false,
    isError: false,
  })
  mockUseChatSettings.mockReturnValue({
    activeConversationId: null,
    createContextForSelectedTools: mockCreateContext,
    createContextForAllTools: mockCreateContext,
  })
  mockUseConversationManager.mockReturnValue({
    initialTitle: '',
    isCreating: false,
    startNewConversation: mockStartNewConversation,
    createConversation: mockCreateConversation,
    setInitialTitle: mockSetInitialTitle,
  })

  const user = userEvent.setup()

  render(<AgenticChat />)

  const input = screen.getByTestId('chat-input')
  await user.type(input, prompt)
  await user.click(screen.getByTestId('send-btn'))

  await waitFor(() => expect(mockCreateConversation).toHaveBeenCalledWith(prompt))
})

test('calls editCompletion and refetch conversation after message editing', async () => {
  render(<AgenticChat />)

  const editBtn = screen.getByTestId('edit-question')
  await userEvent.click(editBtn)

  expect(mockEditCompletion).nthCalledWith(1, {
    conversationId: mockConversation.id,
    completionId: mockCompletionId,
    userQuestion: newPrompt,
    chatArguments: mockContext,
    onFinal: expect.any(Function),
  })

  expect(mockRefetchConversationFn).nthCalledWith(1, {
    conversationId: mockConversation.id,
  })
})
