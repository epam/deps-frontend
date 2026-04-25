
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import { AgentConversationsFilterKey } from '@/constants/navigation'
import { AgenticAiParameters } from '@/enums/AgenticAiParameters'
import {
  Tool,
  ToolParameter,
  ToolSet,
} from '@/models/AgenticChat'
import { render } from '@/utils/rendererRTL'
import { ChatSettingsContext, ChatSettingsProvider } from './ChatSettingsProvider'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/selectors/documentReviewPage', () => ({
  documentSelector: () => ({ _id: mockDocumentId }),
  documentTypeSelector: () => ({ code: mockDocumentTypeCode }),
}))

const documentIdParameter = new ToolParameter({ name: AgenticAiParameters.DOCUMENT_ID })
const documentTypeIdParameter = new ToolParameter({ name: AgenticAiParameters.DOCUMENT_TYPE_ID })

const mockTool1 = new Tool({
  code: 'mockTool1',
  name: 'Tool 1',
  parameters: [documentIdParameter, documentTypeIdParameter],
})

const mockTool2 = new Tool({
  code: 'mockTool2',
  name: 'Tool 2',
  parameters: [documentIdParameter],
})

const mockToolSet = new ToolSet({
  id: 'id',
  code: 'toolSetCode1',
  name: 'ToolSet 1',
  tools: [mockTool1, mockTool2],
})

const mockToolId1 = `${mockToolSet.code}-${mockTool1.code}`
const mockToolId2 = `${mockToolSet.code}-${mockTool2.code}`

const mockToolsById = {
  [mockToolId1]: {
    ...mockTool1,
    id: mockToolId1,
    toolSetCode: mockToolSet.code,
  },
  [mockToolId2]: {
    ...mockTool2,
    id: mockToolId2,
    toolSetCode: mockToolSet.code,
  },
}

const mockDocumentId = 'docId'
const mockDocumentTypeCode = 'docTypeCode'
const mockActiveLLMSettings = 'llm'
const mockPageSpan = ['1', '2']
const mockSelectedToolIds = [mockToolId1]

const mockCurrentDocumentData = {
  documentId: mockDocumentId,
}

const mockActiveDocumentData = {
  documentId: 'doc-123',
  title: 'Test Document',
}

const PER_PAGE = 20
const mockTitle = 'title'
const DEFAULT_PAGE = 1

const defaultFilters = {
  [AgentConversationsFilterKey.SIZE]: PER_PAGE,
}

const mockFilter = {
  ...defaultFilters,
  [AgentConversationsFilterKey.AGENT_VENDOR_ID]: 'vendor-id',
}

const MockComponent = () => {
  const {
    activeLLMSettings,
    setActiveLLMSettings,
    selectedToolIds,
    setSelectedToolIds,
    pageSpan,
    setPageSpan,
    toolsById,
    setToolsById,
    createContextForSelectedTools,
    createContextForAllTools,
    isExpandedView,
    isModalVisible,
    closeModal,
    openModal,
    toggleExpanded,
    activeConversationId,
    setActiveConversationId,
    activeDocumentData,
    setActiveDocumentData,
    filters,
    setFilters,
    setTitleFilter,
    isNewConversationMode,
    setIsNewConversationMode,
    pagination,
    setPagination,
  } = useContext(ChatSettingsContext)

  const contextForSelectedTools = createContextForSelectedTools()
  const contextForAllTools = createContextForAllTools()

  return (
    <div>
      <span data-testid="activeLLMSettings">{String(activeLLMSettings)}</span>
      <span data-testid="selectedToolIds">{JSON.stringify(selectedToolIds)}</span>
      <span data-testid="toolsById">{JSON.stringify(toolsById)}</span>
      <span data-testid="pageSpan">{JSON.stringify(pageSpan)}</span>
      <span data-testid="contextForSelectedTools">{JSON.stringify(contextForSelectedTools)}</span>
      <span data-testid="contextForAllTools">{JSON.stringify(contextForAllTools)}</span>
      <span data-testid="isExpandedView">{JSON.stringify(isExpandedView)}</span>
      <span data-testid="isModalVisible">{JSON.stringify(isModalVisible)}</span>
      <span data-testid="activeConversationId">{JSON.stringify(activeConversationId)}</span>
      <span data-testid="activeDocumentData">{JSON.stringify(activeDocumentData)}</span>
      <span data-testid="filters">{JSON.stringify(filters)}</span>
      <span data-testid="isNewConversationMode">{JSON.stringify(isNewConversationMode)}</span>
      <span data-testid="pagination">{JSON.stringify(pagination)}</span>
      <button
        data-testid="setActiveLLMSettings"
        onClick={() => setActiveLLMSettings(mockActiveLLMSettings)}
      >
        Set LLM Settings
      </button>
      <button
        data-testid="setSelectedToolIds"
        onClick={() => setSelectedToolIds(mockSelectedToolIds)}
      >
        Select tools
      </button>
      <button
        data-testid="setPageSpan"
        onClick={() => setPageSpan(mockPageSpan)}
      >
        Set Page Span
      </button>
      <button
        data-testid="setToolsById"
        onClick={() => setToolsById(mockToolsById)}
      >
        Set Tools By Id
      </button>
      <button
        data-testid="closeModal"
        onClick={() => closeModal()}
      >
        Close Modal
      </button>
      <button
        data-testid="openModal"
        onClick={() => openModal()}
      >
        Open Modal
      </button>
      <button
        data-testid="toggleExpanded"
        onClick={() => toggleExpanded()}
      >
        Toggle Expanded View
      </button>
      <button
        data-testid="setActiveConversationId"
        onClick={() => setActiveConversationId('conv-123')}
      >
        Set Active Conversation
      </button>
      <button
        data-testid="setActiveDocumentData"
        onClick={() => setActiveDocumentData(mockActiveDocumentData)}
      >
        Set Active Document Data
      </button>
      <button
        data-testid="setFilters"
        onClick={() => setFilters(mockFilter)}
      >
        Set Filters
      </button>
      <button
        data-testid="setTitleFilter"
        onClick={() => setTitleFilter(mockTitle)}
      >
        Set Title Filters
      </button>
      <button
        data-testid="setIsNewConversationModeTrue"
        onClick={() => setIsNewConversationMode(true)}
      >
        Start New Conversation Mode
      </button>
      <button
        data-testid="setPagination"
        onClick={() => setPagination(DEFAULT_PAGE + 1)}
      >
        Set Pagination
      </button>
    </div>
  )
}

test('renders children correctly', () => {
  const mockTestId = 'children-id'

  render(
    <ChatSettingsProvider>
      <div data-testid={mockTestId} />
    </ChatSettingsProvider>,
  )

  expect(screen.getByTestId(mockTestId)).toBeInTheDocument()
})

test('provides default context values to children', () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  expect(screen.getByTestId('activeLLMSettings').textContent).toBe(JSON.stringify(null))
  expect(screen.getByTestId('selectedToolIds').textContent).toBe(JSON.stringify([]))
  expect(screen.getByTestId('toolsById').textContent).toBe(JSON.stringify({}))
  expect(screen.getByTestId('pageSpan').textContent).toBe(JSON.stringify([]))
  expect(screen.getByTestId('isExpandedView').textContent).toBe(JSON.stringify(false))
  expect(screen.getByTestId('isModalVisible').textContent).toBe(JSON.stringify(false))
  expect(screen.getByTestId('activeConversationId').textContent).toBe(JSON.stringify(null))
  expect(screen.getByTestId('activeDocumentData').textContent).toBe(JSON.stringify(mockCurrentDocumentData))
  expect(screen.getByTestId('filters').textContent).toBe(JSON.stringify(defaultFilters))
  expect(screen.getByTestId('pagination').textContent).toBe(JSON.stringify(DEFAULT_PAGE))
  expect(screen.getByTestId('isNewConversationMode').textContent).toBe(JSON.stringify(false))
})

test('sets Active LLM settings when click on Set LLM Settings button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setActiveLLMSettings'))
  expect(screen.getByTestId('activeLLMSettings').textContent).toBe(mockActiveLLMSettings)
})

test('sets Selected tools when click on Select tools button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setSelectedToolIds'))
  expect(screen.getByTestId('selectedToolIds').textContent).toBe(JSON.stringify(mockSelectedToolIds))
})

test('sets Page span when click on Set Page Span button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setPageSpan'))
  expect(screen.getByTestId('pageSpan').textContent).toBe(JSON.stringify(mockPageSpan))
})

test('sets Tools by id when click on Set Tools By Id button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setToolsById'))
  expect(screen.getByTestId('toolsById').textContent).toBe(JSON.stringify(mockToolsById))
})

test('returns correct result of createContextForAllTools function if there is tools list', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setToolsById'))

  const expectedContextArguments = {
    [mockToolSet.code]: {
      [mockTool1.code]: [
        {
          parameter: documentIdParameter.name,
          value: mockDocumentId,
        },
        {
          parameter: documentTypeIdParameter.name,
          value: mockDocumentTypeCode,
        },
      ],
      [mockTool2.code]: [{
        parameter: documentIdParameter.name,
        value: mockDocumentId,
      }],
    },
  }

  const contextForAllTools = JSON.parse(screen.getByTestId('contextForAllTools').textContent)
  expect(contextForAllTools).toStrictEqual(expectedContextArguments)
})

test('returns correct result of createContextForSelectedTools function if there are tools list and selected tool', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setToolsById'))
  await userEvent.click(screen.getByTestId('setSelectedToolIds'))

  const expectedContextArguments = {
    [mockToolSet.code]: {
      [mockTool1.code]: [{
        parameter: documentIdParameter.name,
        value: mockDocumentId,
      },
      {
        parameter: documentTypeIdParameter.name,
        value: mockDocumentTypeCode,
      }],
    },
  }

  const contextForSelectedTools = JSON.parse(screen.getByTestId('contextForSelectedTools').textContent)
  expect(contextForSelectedTools).toStrictEqual(expectedContextArguments)
})

test('sets modal visible when click on Open Modal button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  expect(screen.getByTestId('isModalVisible').textContent).toBe(JSON.stringify(false))

  await userEvent.click(screen.getByTestId('openModal'))
  expect(screen.getByTestId('isModalVisible').textContent).toBe(JSON.stringify(true))
})

test('toggles expanded view when click on Toggle Expanded View button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('toggleExpanded'))
  expect(screen.getByTestId('isExpandedView').textContent).toBe(JSON.stringify(true))

  await userEvent.click(screen.getByTestId('toggleExpanded'))
  expect(screen.getByTestId('isExpandedView').textContent).toBe(JSON.stringify(false))
})

test('sets filters to default when click on Toggle Expanded View button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setFilters'))
  expect(screen.getByTestId('filters').textContent).toBe(JSON.stringify(mockFilter))

  await userEvent.click(screen.getByTestId('toggleExpanded'))
  expect(screen.getByTestId('filters').textContent).toBe(JSON.stringify(defaultFilters))
})

test('reset document data and current conversation when click on Toggle Expanded View button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setActiveDocumentData'))
  await userEvent.click(screen.getByTestId('setActiveConversationId'))
  expect(screen.getByTestId('activeDocumentData').textContent).toBe(JSON.stringify(mockActiveDocumentData))
  expect(screen.getByTestId('activeConversationId').textContent).toBe(JSON.stringify('conv-123'))

  await userEvent.click(screen.getByTestId('toggleExpanded'))
  expect(screen.getByTestId('activeDocumentData').textContent).toBe(JSON.stringify(mockCurrentDocumentData))
  expect(screen.getByTestId('activeConversationId').textContent).toBe(JSON.stringify(null))
})

test('closes modal and resets state when click on Close Modal button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('openModal'))
  await userEvent.click(screen.getByTestId('setIsNewConversationModeTrue'))
  await userEvent.click(screen.getByTestId('setFilters'))

  expect(screen.getByTestId('isModalVisible').textContent).toBe(JSON.stringify(true))
  expect(screen.getByTestId('isNewConversationMode').textContent).toBe(JSON.stringify(true))
  expect(screen.getByTestId('filters').textContent).toBe(JSON.stringify(mockFilter))

  await userEvent.click(screen.getByTestId('closeModal'))

  expect(screen.getByTestId('isModalVisible').textContent).toBe(JSON.stringify(false))
  expect(screen.getByTestId('isNewConversationMode').textContent).toBe(JSON.stringify(false))
  expect(screen.getByTestId('filters').textContent).toBe(JSON.stringify(defaultFilters))
})

test('sets activeConversationId when click on Set Active Conversation button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setActiveConversationId'))
  expect(screen.getByTestId('activeConversationId').textContent).toBe(JSON.stringify('conv-123'))
})

test('sets activeDocumentData when click on Set Active Document Data button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setActiveDocumentData'))
  expect(screen.getByTestId('activeDocumentData').textContent).toBe(JSON.stringify(mockActiveDocumentData))
})

test('sets new filters when click on Set Filters button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setFilters'))
  expect(screen.getByTestId('filters').textContent).toBe(JSON.stringify(mockFilter))
})

test('sets new filters when click on Set Title Filter button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setFilters'))
  expect(screen.getByTestId('filters').textContent).toBe(JSON.stringify(mockFilter))

  await userEvent.click(screen.getByTestId('setTitleFilter'))
  expect(screen.getByTestId('filters').textContent).toBe(JSON.stringify({
    ...mockFilter,
    [AgentConversationsFilterKey.TITLE]: mockTitle,
  }))
})

test('sets isNewConversationMode to true when click on Set New Conversation Mode True button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  expect(screen.getByTestId('isNewConversationMode').textContent).toBe(JSON.stringify(false))

  await userEvent.click(screen.getByTestId('setIsNewConversationModeTrue'))
  expect(screen.getByTestId('isNewConversationMode').textContent).toBe(JSON.stringify(true))
})

test('sets new pagination when click on Set Pagination button', async () => {
  render(
    <ChatSettingsProvider>
      <MockComponent />
    </ChatSettingsProvider>,
  )

  await userEvent.click(screen.getByTestId('setPagination'))
  expect(screen.getByTestId('pagination').textContent).toBe(JSON.stringify(DEFAULT_PAGE + 1))
})
