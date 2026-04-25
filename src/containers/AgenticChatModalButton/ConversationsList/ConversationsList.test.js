
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgenticAiModes } from '@/enums/AgenticAiModes'
import { ConversationsListItem } from '@/models/AgenticChat'
import { documentSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { ConversationsList } from './ConversationsList'

Element.prototype.scrollIntoView = jest.fn()
const mockUseChatSettings = jest.fn()
const mockSetActiveConversationId = jest.fn()
const mockSetActiveDocumentData = jest.fn()

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useChatSettings: () => mockUseChatSettings(),
}))

jest.mock('../InfiniteScrollDocumentsList', () => ({
  InfiniteScrollDocumentsList: ({ children, setDocumentsById }) => {
    const onClick = () => {
      setDocumentsById(mockDocsByIds)
    }

    return (
      <>
        <div data-testid='infinite-scroll'>{children}</div>
        <button
          data-testid='load more'
          onClick={onClick}
        />
      </>
    )
  },
}))

jest.mock('./ConversationsListItem', () => ({
  ConversationsListItem: ({
    conversationId,
    conversationTitle,
    onAfterDelete,
    selectConversation,
    updateConversationTitle,
  }) => {
    const onClick = () => updateConversationTitle(newConversationTitle)

    return (
      <>
        <div onClick={selectConversation}>{conversationTitle}</div>
        <button
          data-testid={`rename-button-${conversationId}`}
          onClick={onClick}
        />
        <button
          data-testid={`delete-button-${conversationId}`}
          onClick={onAfterDelete}
        />
      </>
    )
  },
}))

jest.mock('./ConversationsList.styles', () => ({
  ...jest.requireActual('./ConversationsList.styles'),
  ExpandIcon: () => <span data-testid='expand-icon' />,
  Collapse: ({ renderPanels, renderExpandButton }) => (
    <div data-testid='collapse'>
      {renderPanels(mockDocIds)}
      {renderExpandButton({ isActive: false }, jest.fn())}
    </div>
  ),
  Panel: ({ header, children, $isActive }) => (
    <div data-testid='panel'>
      <div
        data-isactive={$isActive}
        data-testid='panel-header'
      >
        {header}
      </div>
      <div data-testid='panel-content'>{children}</div>
    </div>
  ),
}))

const currentDocument = documentSelector.getSelectorMockValue()

const otherDocument = {
  _id: 'doc2',
  title: 'Document 2 Title',
}

const mockDocsByIds = {
  [currentDocument._id]: currentDocument.title,
  [otherDocument._id]: otherDocument.title,
}

const mockDocIds = [currentDocument._id, otherDocument._id]
const newConversationTitle = 'New Conversation Title'

const currentDocumentConversation1 = new ConversationsListItem({
  id: 'id1',
  agentVendorId: 'agentId',
  mode: {
    id: 'modeId',
    code: AgenticAiModes.DOCUMENT,
  },
  title: 'Conversation 1 Title',
  relation: {
    details: {
      documentId: currentDocument._id,
    },
  },
})

const currentDocumentConversation2 = new ConversationsListItem({
  id: 'id2',
  agentVendorId: 'agentId',
  mode: {
    id: 'modeId',
    code: AgenticAiModes.DOCUMENT,
  },
  title: 'Conversation 2 Title',
  relation: {
    details: {
      documentId: currentDocument._id,
    },
  },
})

const otherDocumentConversation = new ConversationsListItem({
  id: 'id3',
  agentVendorId: 'agentId',
  mode: {
    id: 'modeId',
    code: AgenticAiModes.DOCUMENT,
  },
  title: 'Conversation 3 Title',
  relation: {
    details: {
      documentId: otherDocument._id,
    },
  },
})

const mockConversations = {
  [currentDocument._id]: [currentDocumentConversation1, currentDocumentConversation2],
  [otherDocument._id]: [otherDocumentConversation],
}

mockUseChatSettings.mockReturnValue({
  activeConversationId: currentDocumentConversation1.id,
  activeDocumentData: { documentId: currentDocument._id },
  setActiveConversationId: mockSetActiveConversationId,
  setActiveDocumentData: mockSetActiveDocumentData,
})

const defaultProps = {
  conversations: mockConversations,
  documentsIds: mockDocIds,
  fetchConversations: jest.fn(),
  hasMore: false,
  isFetching: false,
}

test('renders Infinite scroll when conversations exist', async () => {
  render(<ConversationsList {...defaultProps} />)

  expect(screen.getByTestId('infinite-scroll')).toBeInTheDocument()
})

test('displays a list of documents with the current document first', async () => {
  render(<ConversationsList {...defaultProps} />)

  const loadMore = screen.getByTestId('load more')
  await userEvent.click(loadMore)

  const [document1, document2] = screen.getAllByTestId('panel-header')

  expect(screen.getByTestId('collapse')).toBeInTheDocument()
  expect(screen.getAllByTestId('panel')).toHaveLength(mockDocIds.length)
  expect(document1).toHaveTextContent(currentDocument.title)
  expect(document1).toHaveAttribute('data-isactive', 'true')
  expect(document2).toHaveTextContent(otherDocument.title)
  expect(document2).toHaveAttribute('data-isactive', 'false')
})

test('renders conversations list for every document', async () => {
  render(<ConversationsList {...defaultProps} />)

  const loadMore = screen.getByTestId('load more')
  await userEvent.click(loadMore)

  const [list1, list2] = screen.getAllByTestId('panel-content')

  expect(list1).toHaveTextContent(currentDocumentConversation1.title)
  expect(list1).toHaveTextContent(currentDocumentConversation2.title)
  expect(list2).toHaveTextContent(otherDocumentConversation.title)
})

test('calls setActiveConversationId and setActiveDocumentData on conversation click', async () => {
  render(<ConversationsList {...defaultProps} />)

  const loadMore = screen.getByTestId('load more')
  await userEvent.click(loadMore)

  const conversation = screen.getByText(otherDocumentConversation.title)
  await userEvent.click(conversation)

  expect(mockSetActiveConversationId).nthCalledWith(1, otherDocumentConversation.id)
  expect(mockSetActiveDocumentData).nthCalledWith(
    1,
    {
      documentId: otherDocument._id,
      title: otherDocument.title,
    },
  )
})

test('updates conversation title on rename button click', async () => {
  render(<ConversationsList {...defaultProps} />)

  const loadMore = screen.getByTestId('load more')
  await userEvent.click(loadMore)

  const renameButton = screen.getByTestId(`rename-button-${otherDocumentConversation.id}`)
  await userEvent.click(renameButton)
  await userEvent.click(loadMore)

  const [, list2] = screen.getAllByTestId('panel-content')
  expect(list2).toHaveTextContent(newConversationTitle)
})

test('calls fetchConversations after delete button click', async () => {
  render(<ConversationsList {...defaultProps} />)

  const loadMore = screen.getByTestId('load more')
  await userEvent.click(loadMore)

  const deleteButton = screen.getByTestId(`delete-button-${otherDocumentConversation.id}`)
  await userEvent.click(deleteButton)

  expect(defaultProps.fetchConversations).toHaveBeenCalled()
})

test('returns null when there are no sorted document IDs', () => {
  const { container } = render(
    <ConversationsList
      {...defaultProps}
      conversations={{}}
      documentsIds={[]}
    />,
  )

  expect(container).toBeEmptyDOMElement()
  expect(screen.queryByTestId('infinite-scroll')).not.toBeInTheDocument()
})
