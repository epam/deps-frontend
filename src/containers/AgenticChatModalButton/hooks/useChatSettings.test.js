
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { renderHook } from '@testing-library/react-hooks/dom'
import { documentSelector } from '@/selectors/documentReviewPage'
import { ChatSettingsProvider } from '../providers'
import { useChatSettings } from './useChatSettings'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')
jest.mock('react-redux', () => mockReactRedux)

const mockDocument = documentSelector.getSelectorMockValue()

test('retrieves the context value provided by ChatSettingsProvider', () => {
  const wrapper = ({ children }) => (
    <ChatSettingsProvider>{children}</ChatSettingsProvider>
  )

  const { result } = renderHook(() => useChatSettings(), { wrapper })

  expect(result.current).toEqual({
    activeConversationId: null,
    setActiveConversationId: expect.any(Function),
    activeDocumentData: {
      documentId: mockDocument._id,
    },
    setActiveDocumentData: expect.any(Function),
    activeLLMSettings: null,
    setActiveLLMSettings: expect.any(Function),
    selectedToolIds: [],
    setSelectedToolIds: expect.any(Function),
    pageSpan: [],
    setPageSpan: expect.any(Function),
    toolsById: {},
    setToolsById: expect.any(Function),
    isExpandedView: false,
    isModalVisible: false,
    isNewConversationMode: false,
    setIsNewConversationMode: expect.any(Function),
    closeModal: expect.any(Function),
    openModal: expect.any(Function),
    toggleExpanded: expect.any(Function),
    filters: expect.any(Object),
    setFilters: expect.any(Function),
    setTitleFilter: expect.any(Function),
    createContextForAllTools: expect.any(Function),
    createContextForSelectedTools: expect.any(Function),
    pagination: expect.any(Number),
    setPagination: expect.any(Function),
  })
})
