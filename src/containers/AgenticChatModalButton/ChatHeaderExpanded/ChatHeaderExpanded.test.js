
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { ChatHeaderExpanded } from './ChatHeaderExpanded'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../ReadOnlyViewHeader', () => mockShallowComponent('ReadOnlyViewHeader'))

jest.mock('../InitialConversationTitleInput', () =>
  mockShallowComponent('InitialConversationTitleInput'),
)

const mockActiveConversationId = 'conv-1'
let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    activeConversationId: null,
    isConversationFromDifferentDocument: false,
    initialTitle: 'New Conversation',
    onTitleChange: jest.fn(),
  }
})

test('renders ReadOnlyViewHeader when conversation is from different document', () => {
  render(
    <ChatHeaderExpanded
      {...defaultProps}
      activeConversationId={mockActiveConversationId}
      isConversationFromDifferentDocument
    />,
  )

  expect(screen.getByTestId('ReadOnlyViewHeader')).toBeInTheDocument()
  expect(screen.queryByTestId('InitialConversationTitleInput')).not.toBeInTheDocument()
})

test('renders InitialConversationTitleInput when no active conversation', () => {
  render(<ChatHeaderExpanded {...defaultProps} />)

  expect(screen.getByTestId('InitialConversationTitleInput')).toBeInTheDocument()
  expect(screen.queryByTestId('ReadOnlyViewHeader')).not.toBeInTheDocument()
})

test('renders nothing when active conversation exists from same document', () => {
  const { container } = render(
    <ChatHeaderExpanded
      {...defaultProps}
      activeConversationId={mockActiveConversationId}
    />,
  )

  expect(container).toBeEmptyDOMElement()
})
