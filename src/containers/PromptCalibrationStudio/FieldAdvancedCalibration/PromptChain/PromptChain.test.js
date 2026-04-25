
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Field, Query, QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { render } from '@/utils/rendererRTL'
import { PromptChain } from './PromptChain'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => <div>{children}</div>,
}))
jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: jest.fn(),
}))

jest.mock('./EmptyPromptState', () => ({
  EmptyPromptState: ({ onClick }) => <button onClick={onClick}>{mockEmptyPromptStateContent}</button>,
}))

jest.mock('./NodesBuilder', () => ({
  NodesBuilder: ({ nodes, onAdd, onEdit, onDelete, onReorder }) => (
    <div>
      <span>{mockNodesContent}</span>
      <button onClick={onAdd}>{mockOnAddContent}</button>
      <button onClick={() => onEdit(nodes[0])}>{mockOnEditContent}</button>
      <button onClick={() => onDelete([])}>{mockSetNodesContent}</button>
      <button onClick={() => onReorder([...nodes].reverse())}>{mockOnReorderContent}</button>
    </div>
  ),
}))
jest.mock('./AddPromptModal', () => ({
  AddPromptModal: ({ onClose, onSave }) => (
    <div>
      <span>{mockAddPromptModalContent}</span>
      <button onClick={onClose}>{mockOnCloseContent}</button>
      <button onClick={() => onSave('New Name', 'New Prompt')}>{mockOnSaveContent}</button>
    </div>
  ),
}))

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    activeField: mockActiveField,
  })),
}))

const mockOnSaveNodes = jest.fn()
const mockEmptyPromptStateContent = 'empty-prompt-state'
const mockNodesContent = 'nodes'
const mockOnAddContent = 'on-add'
const mockOnEditContent = 'on-edit'
const mockSetNodesContent = 'set-nodes'
const mockOnReorderContent = 'on-reorder'
const mockAddPromptModalContent = 'add-prompt-modal'
const mockOnCloseContent = 'on-close'
const mockOnSaveContent = 'on-save'

const mockNode1 = new QueryNode({
  id: 'node-1',
  name: 'Node 1',
  prompt: 'Test prompt 1',
})

const mockNode2 = new QueryNode({
  id: 'node-2',
  name: 'Node 2',
  prompt: 'Test prompt 2',
})

const mockActiveField = new Field({
  id: 'field-1',
  extractorId: 'extractor-1',
  name: 'Test Field',
  query: new Query({
    nodes: [mockNode1],
  }),
})

const defaultProps = {
  onSaveNodes: mockOnSaveNodes,
  queryNodes: [mockNode1],
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders EmptyPromptState when queryNodes array is empty', () => {
  const props = {
    ...defaultProps,
    queryNodes: [],
  }

  render(<PromptChain {...props} />)

  const emptyPromptState = screen.getByRole('button', { name: mockEmptyPromptStateContent })
  const nodesBuilder = screen.queryByText(mockNodesContent)

  expect(emptyPromptState).toBeInTheDocument()
  expect(nodesBuilder).toBeNull()
})

test('renders NodesBuilder when queryNodes array has items', () => {
  render(<PromptChain {...defaultProps} />)

  const emptyPromptState = screen.queryByRole('button', { name: mockEmptyPromptStateContent })
  const nodesBuilder = screen.getByText(mockNodesContent)

  expect(emptyPromptState).toBeNull()
  expect(nodesBuilder).toBeInTheDocument()
})

test('does not render AddPromptModal initially', () => {
  render(<PromptChain {...defaultProps} />)

  const addPromptModal = screen.queryByText(mockAddPromptModalContent)

  expect(addPromptModal).toBeNull()
})

test('renders AddPromptModal when EmptyPromptState onClick is triggered', async () => {
  const props = {
    ...defaultProps,
    queryNodes: [],
  }

  render(<PromptChain {...props} />)

  const emptyPromptState = screen.getByRole('button', { name: mockEmptyPromptStateContent })
  await userEvent.click(emptyPromptState)

  const addPromptModal = screen.getByText(mockAddPromptModalContent)

  expect(addPromptModal).toBeInTheDocument()
})

test('renders AddPromptModal when NodesBuilder onAdd is triggered', async () => {
  render(<PromptChain {...defaultProps} />)

  const nodesBuilder = screen.getByRole('button', { name: mockOnAddContent })
  await userEvent.click(nodesBuilder)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })
})

test('renders AddPromptModal when NodesBuilder onEdit is triggered', async () => {
  render(<PromptChain {...defaultProps} />)

  const nodesBuilder = screen.getByRole('button', { name: mockOnEditContent })
  await userEvent.click(nodesBuilder)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })
})

test('calls onSaveNodes when updating existing node', async () => {
  render(<PromptChain {...defaultProps} />)

  const nodesBuilder = screen.getByRole('button', { name: mockOnEditContent })
  await userEvent.click(nodesBuilder)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })

  const saveButton = screen.getByRole('button', { name: mockOnSaveContent })
  await userEvent.click(saveButton)

  expect(mockOnSaveNodes).toHaveBeenCalled()
})

test('closes AddPromptModal when after editing a node', async () => {
  render(<PromptChain {...defaultProps} />)

  const nodesBuilder = screen.getByRole('button', { name: mockOnEditContent })
  await userEvent.click(nodesBuilder)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })

  const saveButton = screen.getByRole('button', { name: mockOnSaveContent })
  await userEvent.click(saveButton)

  expect(mockOnSaveNodes).toHaveBeenCalled()

  await waitFor(() => {
    const addPromptModal = screen.queryByText(mockAddPromptModalContent)
    expect(addPromptModal).not.toBeInTheDocument()
  })
})

test('calls onSaveNodes when adding new node', async () => {
  render(<PromptChain {...defaultProps} />)

  const nodesBuilder = screen.getByRole('button', { name: mockOnAddContent })
  await userEvent.click(nodesBuilder)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })

  const saveButton = screen.getByRole('button', { name: mockOnSaveContent })
  await userEvent.click(saveButton)

  expect(mockOnSaveNodes).toHaveBeenCalled()
})

test('closes AddPromptModal when after adding a new node', async () => {
  render(<PromptChain {...defaultProps} />)

  const nodesBuilder = screen.getByRole('button', { name: mockOnAddContent })
  await userEvent.click(nodesBuilder)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })

  const saveButton = screen.getByRole('button', { name: mockOnSaveContent })
  await userEvent.click(saveButton)

  expect(mockOnSaveNodes).toHaveBeenCalled()

  await waitFor(() => {
    const addPromptModal = screen.queryByText(mockAddPromptModalContent)
    expect(addPromptModal).not.toBeInTheDocument()
  })
})

test('inserts new node at correct position', async () => {
  const props = {
    ...defaultProps,
    queryNodes: [mockNode1, mockNode2],
  }

  render(<PromptChain {...props} />)

  const nodesBuilder = screen.getByRole('button', { name: mockOnAddContent })
  await userEvent.click(nodesBuilder)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })

  const saveButton = screen.getByRole('button', { name: mockOnSaveContent })
  await userEvent.click(saveButton)

  await waitFor(() => {
    expect(mockOnSaveNodes).toHaveBeenCalledTimes(1)
  })
  expect(mockOnSaveNodes).toHaveBeenNthCalledWith(1, [
    expect.objectContaining({
      name: 'New Name',
      prompt: 'New Prompt',
    }),
    mockNode1,
    mockNode2,
  ])
})

test('closes AddPromptModal when onClose is called', async () => {
  render(<PromptChain {...defaultProps} />)

  const nodesBuilder = screen.getByRole('button', { name: mockOnAddContent })
  await userEvent.click(nodesBuilder)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })

  const closeButton = screen.getByRole('button', { name: mockOnCloseContent })
  await userEvent.click(closeButton)

  await waitFor(() => {
    const addPromptModal = screen.queryByText(mockAddPromptModalContent)
    expect(addPromptModal).not.toBeInTheDocument()
  })
})

test('sets activeNode when onEdit is triggered', async () => {
  render(<PromptChain {...defaultProps} />)

  const editButton = screen.getByRole('button', { name: mockOnEditContent })
  await userEvent.click(editButton)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })
})

test('clears activeNode after modal is closed', async () => {
  render(<PromptChain {...defaultProps} />)

  const editButton = screen.getByRole('button', { name: mockOnEditContent })
  await userEvent.click(editButton)

  await waitFor(() => {
    const addPromptModal = screen.getByText(mockAddPromptModalContent)
    expect(addPromptModal).toBeInTheDocument()
  })

  const closeButton = screen.getByRole('button', { name: mockOnCloseContent })
  await userEvent.click(closeButton)

  await waitFor(() => {
    const addPromptModal = screen.queryByText(mockAddPromptModalContent)
    expect(addPromptModal).not.toBeInTheDocument()
  })
})

test('calls onSaveNodes when onDelete is triggered from NodesBuilder', async () => {
  jest.clearAllMocks()

  render(<PromptChain {...defaultProps} />)

  const setNodesButton = screen.getByRole('button', { name: mockSetNodesContent })
  await userEvent.click(setNodesButton)

  expect(mockOnSaveNodes).toHaveBeenCalledWith([])
})

test('calls onSaveNodes with reordered nodes when onReorder is triggered', async () => {
  jest.clearAllMocks()

  const props = {
    ...defaultProps,
    queryNodes: [mockNode1, mockNode2],
  }

  render(<PromptChain {...props} />)

  const reorderButton = screen.getByRole('button', { name: mockOnReorderContent })
  await userEvent.click(reorderButton)

  expect(mockOnSaveNodes).toHaveBeenCalledWith([mockNode2, mockNode1])
})
