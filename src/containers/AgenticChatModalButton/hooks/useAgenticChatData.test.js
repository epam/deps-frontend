
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks/dom'
import { AgentConversationsFilterKey } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { AgentVendor } from '@/models/AgenticChat'
import { documentSelector } from '@/selectors/documentReviewPage'
import { useAgenticChatData } from './useAgenticChatData'

const mockUseLazyFetchConversationsQuery = jest.fn()
const mockUseFetchAgentVendorsQuery = jest.fn()
const mockUseFetchModeQuery = jest.fn()
const mockUseChatSettings = jest.fn()
const mockSetFilters = jest.fn()
const mockSetPagination = jest.fn()

const mockFetchConversationsFn = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve(mockCurrentDocConversationsResponse)),
}))

jest.mock('@/apiRTK/agenticAiApi', () => ({
  useLazyFetchConversationsQuery: (...args) => mockUseLazyFetchConversationsQuery(...args),
  useFetchAgentVendorsQuery: (...args) => mockUseFetchAgentVendorsQuery(...args),
  useFetchModeQuery: (...args) => mockUseFetchModeQuery(...args),
}))

jest.mock('./useChatSettings', () => ({
  useChatSettings: () => mockUseChatSettings(),
}))

jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/selectors/documentReviewPage')

const mockDocument = documentSelector.getSelectorMockValue()

const currentDocConversations = {
  [mockDocument._id]: [{ id: 'conversation-1' }],
}

const documentsConversations = {
  docId1: [{ id: 'conversation-2' }],
  docId2: [{ id: 'conversation-3' }],
}

const mockCurrentDocConversationsResponse = {
  items: currentDocConversations,
  total: 1,
}

const mockConversationsResponse = {
  items: {
    ...documentsConversations,
    ...currentDocConversations,
  },
  total: 3,
}

const defaultAgentVendorId = 'vendor-1'

const agentVendors = [
  new AgentVendor({
    id: defaultAgentVendorId,
    active: true,
    name: 'Vendor 1',
    description: 'Test vendor',
    avatarUrl: 'https://example.com/avatar.png',
    connectionParameters: {
      baseUrl: 'https://example.com',
    },
  }),
  new AgentVendor({
    id: 'vendor-2',
    active: false,
    name: 'Vendor 2',
    description: 'Test vendor',
    avatarUrl: 'https://example.com/avatar.png',
    connectionParameters: {
      baseUrl: 'https://example.com',
    },
  }),
]

const defaultModes = [{ id: 'mode-1' }]
const defaultPage = 1
const defaultFilters = {
  [AgentConversationsFilterKey.SIZE]: 20,
}

beforeEach(() => {
  jest.clearAllMocks()

  mockUseLazyFetchConversationsQuery.mockReturnValue([
    mockFetchConversationsFn,
    {
      isLoading: false,
      isError: false,
    },
  ])

  mockUseFetchAgentVendorsQuery.mockReturnValue({
    data: agentVendors,
    isLoading: false,
    isError: false,
  })

  mockUseFetchModeQuery.mockReturnValue({
    data: defaultModes,
    isLoading: false,
    isError: false,
  })

  mockUseChatSettings.mockReturnValue({
    filters: defaultFilters,
    isExpandedView: false,
    setFilters: mockSetFilters,
    setPagination: mockSetPagination,
  })
})

test('should skip conversations list fetching when no active vendor id', () => {
  mockUseFetchAgentVendorsQuery.mockReturnValueOnce({
    data: null,
    isLoading: false,
    isError: false,
  })

  renderHook(() => useAgenticChatData())

  expect(mockFetchConversationsFn).not.toHaveBeenCalled()
})

test('should set active vendor id as filter value ', async () => {
  let mockCallBc

  mockSetFilters.mockImplementationOnce((fn) => {
    mockCallBc = fn
  })

  renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(mockSetFilters).toHaveBeenCalled()
  })
  await waitFor(() => {
    expect(mockCallBc(defaultFilters)).toEqual({
      ...defaultFilters,
      [AgentConversationsFilterKey.AGENT_VENDOR_ID]: defaultAgentVendorId,
    })
  })
})

test('should fetch conversations with passed filters for current document in base view', async () => {
  const filters = {
    ...defaultFilters,
    [AgentConversationsFilterKey.TITLE]: 'test title',
  }

  mockUseChatSettings.mockReturnValue({
    filters,
    isExpandedView: false,
    setFilters: mockSetFilters,
    setPagination: mockSetPagination,
  })

  renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(mockFetchConversationsFn).nthCalledWith(
      1,
      {
        ...filters,
        [AgentConversationsFilterKey.DOCUMENT_ID]: [mockDocument._id],
      },
    )
  })
})

test('should fetch conversations for current document and paginated conversations list with passed filters in expanded view', async () => {
  const filters = {
    ...defaultFilters,
    [AgentConversationsFilterKey.TITLE]: 'test title',
  }

  mockUseChatSettings.mockReturnValue({
    filters,
    isExpandedView: true,
    setFilters: mockSetFilters,
    setPagination: mockSetPagination,
  })

  renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(mockFetchConversationsFn).nthCalledWith(
      1,
      {
        ...filters,
        [AgentConversationsFilterKey.DOCUMENT_ID]: [mockDocument._id],
      },
    )
  })
  await waitFor(() => {
    expect(mockFetchConversationsFn).nthCalledWith(
      2,
      {
        ...filters,
        [AgentConversationsFilterKey.PAGE]: defaultPage,
      },
    )
  })
})

test('should fetch conversations list with passed filters and page if fetchConversations is called', async () => {
  const newPage = 2
  const filters = {
    ...defaultFilters,
    [AgentConversationsFilterKey.TITLE]: 'test title',
  }

  mockUseChatSettings.mockReturnValue({
    filters,
    isExpandedView: true,
    setFilters: mockSetFilters,
    setPagination: mockSetPagination,
  })

  const { result } = renderHook(() => useAgenticChatData())

  await act(async () => {
    await result.current.fetchConversations(newPage)
  })

  expect(mockFetchConversationsFn).toHaveBeenCalledWith({
    ...filters,
    [AgentConversationsFilterKey.PAGE]: newPage,
  })
})

test('should return fetched data and aggregated flags in base view', async () => {
  const { result } = renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(result.current).toEqual({
      conversations: currentDocConversations,
      activeAgentVendorId: defaultAgentVendorId,
      documentsIds: [mockDocument._id],
      modes: defaultModes,
      isFetching: false,
      isError: false,
      hasMore: false,
      fetchConversations: expect.any(Function),
    })
  })
})

test('should return fetched data and aggregated flags in expanded view', async () => {
  mockFetchConversationsFn.mockReturnValueOnce({
    unwrap: jest.fn(() => Promise.resolve(mockCurrentDocConversationsResponse)),
  })
  mockFetchConversationsFn.mockReturnValueOnce({
    unwrap: jest.fn(() => Promise.resolve(mockConversationsResponse)),
  })

  mockUseChatSettings.mockReturnValue({
    filters: defaultFilters,
    isExpandedView: true,
    setFilters: mockSetFilters,
    setPagination: mockSetPagination,
  })

  const { result } = renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(result.current).toEqual({
      conversations: {
        ...currentDocConversations,
        ...documentsConversations,
      },
      activeAgentVendorId: defaultAgentVendorId,
      documentsIds: [mockDocument._id, 'docId1', 'docId2'],
      modes: defaultModes,
      isFetching: false,
      isError: false,
      hasMore: false,
      fetchConversations: expect.any(Function),
    })
  })
})

test('should set isFetching to true when any request is loading', async () => {
  mockUseLazyFetchConversationsQuery.mockReturnValue([mockFetchConversationsFn, {
    isFetching: true,
    isError: false,
  }])

  const { result } = renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(result.current.isFetching).toBe(true)
  })
  await waitFor(() => {
    expect(result.current.isError).toBe(false)
  })
})

test('should set isError to true and show warning when conversations fetching fails', async () => {
  mockUseLazyFetchConversationsQuery.mockReturnValue([mockFetchConversationsFn, {
    isFetching: false,
    isError: true,
  }])

  const { result } = renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(result.current.isError).toBe(true)
  })
  await waitFor(() => {
    expect(mockNotification.notifyWarning).nthCalledWith(
      1,
      localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE),
    )
  })
})

test('should set isError to true and show warning when agent vendors fetching fails', () => {
  mockUseFetchAgentVendorsQuery.mockReturnValue({
    data: null,
    isLoading: false,
    isError: true,
  })

  const { result } = renderHook(() => useAgenticChatData())

  expect(result.current.isError).toBe(true)
  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE),
  )
})

test('should set isError to true and show warning when modes fetching fails', async () => {
  mockUseFetchModeQuery.mockReturnValue({
    data: null,
    isLoading: false,
    isError: true,
  })

  const { result } = renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(result.current.isError).toBe(true)
  })
  await waitFor(() => {
    expect(mockNotification.notifyWarning).nthCalledWith(
      1,
      localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE),
    )
  })
})

test('should show warning when there is no active agent vendor in list', () => {
  mockUseFetchAgentVendorsQuery.mockReturnValue({
    data: [{
      id: 'vendor-2',
      active: false,
    }],
    isLoading: false,
    isError: false,
  })

  renderHook(() => useAgenticChatData())

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.AI_CONVERSATION_FETCH_FAILURE_MESSAGE),
  )
})

test('should return hasMore as true if conversations list contains more items than default pagination size', async () => {
  mockFetchConversationsFn.mockReturnValueOnce({
    unwrap: jest.fn(() => Promise.resolve(mockCurrentDocConversationsResponse)),
  })
  mockFetchConversationsFn.mockReturnValueOnce({
    unwrap: jest.fn(() => Promise.resolve({
      ...mockConversationsResponse,
      total: defaultFilters[AgentConversationsFilterKey.SIZE] + 1,
    })),
  })

  mockUseChatSettings.mockReturnValue({
    filters: defaultFilters,
    isExpandedView: true,
    setFilters: mockSetFilters,
    setPagination: mockSetPagination,
  })

  const { result } = renderHook(() => useAgenticChatData())

  await waitFor(() => {
    expect(result.current).toEqual({
      conversations: {
        ...currentDocConversations,
        ...documentsConversations,
      },
      activeAgentVendorId: defaultAgentVendorId,
      documentsIds: [mockDocument._id, 'docId1', 'docId2'],
      modes: defaultModes,
      isFetching: false,
      isError: false,
      hasMore: true,
      fetchConversations: expect.any(Function),
    })
  })
})
