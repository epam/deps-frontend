
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { renderHook, act } from '@testing-library/react-hooks/dom'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { ErrorCode, RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { Localization, localize } from '@/localization/i18n'
import { ConversationsListItem, Mode } from '@/models/AgenticChat'
import { documentSelector } from '@/selectors/documentReviewPage'
import { useConversationManager } from './useConversationManager'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/selectors/documentReviewPage')

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useSelector: jest.fn((selector) => selector()),
}))

const mockCreateConversationMutation = jest.fn()
const mockSetActiveConversationId = jest.fn()
const mockSetIsNewConversationMode = jest.fn()
const mockCreateContextForAllTools = jest.fn(() => mockContextArguments)
let mockActiveConversationId = null

jest.mock('@/apiRTK/agenticAiApi', () => ({
  useCreateConversationMutation: () => [mockCreateConversationMutation, { isLoading: false }],
}))

jest.mock('./useChatSettings', () => ({
  useChatSettings: () => ({
    activeConversationId: mockActiveConversationId,
    setActiveConversationId: mockSetActiveConversationId,
    isNewConversationMode: false,
    setIsNewConversationMode: mockSetIsNewConversationMode,
    createContextForAllTools: mockCreateContextForAllTools,
  }),
}))

const mockDocument = { _id: 'doc-1' }

const mockConversation1 = new ConversationsListItem({
  id: 'conv-1',
  agentVendorId: 'vendor-1',
  title: 'Conversation 1',
  mode: {
    id: 'mode-1',
    code: AgenticAiModes.DOCUMENT,
  },
  relation: { details: { documentId: 'doc-1' } },
})

const mockConversation2 = new ConversationsListItem({
  id: 'conv-2',
  agentVendorId: 'vendor-1',
  title: 'Conversation 2',
  mode: {
    id: 'mode-1',
    code: AgenticAiModes.DOCUMENT,
  },
  relation: { details: { documentId: 'doc-1' } },
})

const mockConversations = {
  [mockDocument._id]: [mockConversation1, mockConversation2],
}

const mockMode = new Mode({
  id: 'mode-1',
  code: AgenticAiModes.DOCUMENT,
  toolSets: [],
})

const mockContextArguments = { argument: 'argument value' }
const mockActiveAgentVendorId = 'vendor-1'
const mockModes = [mockMode]
const mockFetchConversations = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  mockActiveConversationId = null
  documentSelector.mockReturnValue(mockDocument)
  mockCreateConversationMutation.mockReturnValue({
    unwrap: jest.fn(() => Promise.resolve({ id: 'new-conversation-id' })),
  })
})

test('returns initial state with no activeConversationId', () => {
  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  expect(result.current.initialTitle).toBe('')
  expect(result.current.isCreating).toBe(false)
})

test('startNewConversation clears activeConversationId, calls setIsNewConversationMode and resets title', () => {
  const { result } = renderHook(() => useConversationManager({
    conversations: mockConversations,
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  act(() => {
    result.current.setInitialTitle('Some title')
  })

  act(() => {
    result.current.startNewConversation()
  })

  expect(mockSetActiveConversationId).toHaveBeenCalledWith(null)
  expect(mockSetIsNewConversationMode).toHaveBeenCalledWith(true)
  expect(result.current.initialTitle).toBe('')
})

test('createConversation uses firstPrompt as conversation title when title was not set by user', async () => {
  const firstPrompt = 'What is the weather like today?'
  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  await act(async () => {
    await result.current.createConversation(firstPrompt)
  })

  expect(mockCreateConversationMutation).toHaveBeenCalledWith({
    agentVendorId: mockActiveAgentVendorId,
    modeId: mockMode.id,
    title: firstPrompt,
    arguments: mockContextArguments,
    relation: { documentId: mockDocument._id },
  })
})

test('createConversation uses custom title when set by user', async () => {
  const customTitle = 'My Custom Title'
  const firstPrompt = 'What is the weather like today?'
  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  act(() => {
    result.current.setInitialTitle(customTitle)
  })

  await act(async () => {
    await result.current.createConversation(firstPrompt)
  })

  expect(mockCreateConversationMutation).toHaveBeenCalledWith({
    agentVendorId: mockActiveAgentVendorId,
    modeId: mockMode.id,
    title: customTitle,
    arguments: mockContextArguments,
    relation: { documentId: mockDocument._id },
  })
})

test('createConversation returns conversation id on success', async () => {
  const mockApiResponse = { id: 'new-conv-id' }
  mockCreateConversationMutation.mockReturnValue({
    unwrap: jest.fn(() => Promise.resolve(mockApiResponse)),
  })

  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
    fetchConversations: mockFetchConversations,
  }))

  let createdConversationId
  await act(async () => {
    createdConversationId = await result.current.createConversation()
  })

  expect(createdConversationId).toBe('new-conv-id')
})

test('createConversation sets newly created conversation id as active', async () => {
  const mockApiResponse = { id: 'new-conv-id' }
  mockCreateConversationMutation.mockReturnValue({
    unwrap: jest.fn(() => Promise.resolve(mockApiResponse)),
  })

  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  await act(async () => {
    await result.current.createConversation()
  })

  expect(mockSetActiveConversationId).toHaveBeenCalledWith('new-conv-id')
})

test('createConversation calls fetchConversations after creation', async () => {
  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
    fetchConversations: mockFetchConversations,
  }))

  await act(async () => {
    await result.current.createConversation()
  })

  expect(mockFetchConversations).toHaveBeenCalled()
})

test('createConversation shows warning when no active agent vendors', async () => {
  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: null,
    modes: mockModes,
  }))

  let createdConversation
  await act(async () => {
    createdConversation = await result.current.createConversation()
  })

  expect(createdConversation).toBeNull()
  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(
    localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE),
  )
  expect(mockCreateConversationMutation).not.toHaveBeenCalled()
})

test('createConversation shows warning when no modes', async () => {
  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: [],
  }))

  let createdConversation
  await act(async () => {
    createdConversation = await result.current.createConversation()
  })

  expect(createdConversation).toBeNull()
  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(
    localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE),
  )
})

test('createConversation handles error with known error code', async () => {
  const errorCode = ErrorCode.forbidden
  const mockError = {
    data: {
      code: errorCode,
    },
  }
  mockCreateConversationMutation.mockReturnValue({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  })

  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  let createdConversation
  await act(async () => {
    createdConversation = await result.current.createConversation()
  })

  expect(createdConversation).toBeNull()
  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(RESOURCE_ERROR_TO_DISPLAY[errorCode])
})

test('createConversation handles error with unknown error code', async () => {
  const mockError = new Error('Mock Error Message')

  mockCreateConversationMutation.mockReturnValue({
    unwrap: jest.fn(() => Promise.reject(mockError)),
  })

  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  let createdConversation
  await act(async () => {
    createdConversation = await result.current.createConversation()
  })

  expect(createdConversation).toBeNull()
  expect(mockNotification.notifyWarning).toHaveBeenCalledWith(localize(Localization.DEFAULT_ERROR))
})

test('setInitialTitle updates the title', () => {
  const { result } = renderHook(() => useConversationManager({
    conversations: {
      items: [],
      total: 0,
    },
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  act(() => {
    result.current.setInitialTitle('Custom Title')
  })

  expect(result.current.initialTitle).toBe('Custom Title')
})

test('does not auto-select conversation when in new conversation mode', () => {
  const { result } = renderHook(() => useConversationManager({
    conversations: mockConversations,
    activeAgentVendorId: mockActiveAgentVendorId,
    modes: mockModes,
  }))

  jest.clearAllMocks()

  act(() => {
    result.current.startNewConversation()
  })

  expect(mockSetActiveConversationId).toHaveBeenCalledWith(null)
})
