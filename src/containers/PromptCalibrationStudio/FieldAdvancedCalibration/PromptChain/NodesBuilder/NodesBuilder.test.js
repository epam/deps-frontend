
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryNode } from '@/containers/PromptCalibrationStudio/viewModels'
import { render } from '@/utils/rendererRTL'
import { NodesBuilder } from './NodesBuilder'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('./NodesBuilder.styles', () => ({
  Wrapper: ({ children }) => <div>{children}</div>,
  DraggableNodeItem: ({ children, onDragEnd, onMove, index }) => (
    <div data-testid={`${mockDraggableNodeItem}-${index}`}>
      {children}
      <button onClick={() => onMove(index, index + 1)}>{mockOnMoveButton}</button>
      <button onClick={onDragEnd}>{mockOnDragEndButton}</button>
    </div>
  ),
}))
jest.mock('../NodeItem', () => ({
  NodeItem: ({
    node,
    onDelete,
    onEdit,
    promptNumber,
  }) => (
    <div>
      <span data-testid="prompt-number">{promptNumber}</span>
      <span>{node.name}</span>
      <button onClick={() => onDelete(node.id)}>{mockDeleteButton}</button>
      <button onClick={() => onEdit(node.id)}>{mockEditButton}</button>
    </div>
  ),
}))
jest.mock('../NodesConnectionLine', () => ({
  NodesConnectionLine: ({ onAdd }) => <button onClick={onAdd}>{mockNodesConnectionLineContent}</button>,
}))
jest.mock('../AddNewNodeButton', () => ({
  AddNewNodeButton: ({ onClick }) => <button onClick={onClick}>{mockAddNewNodeButtonContent}</button>,
}))

const mockNodesConnectionLineContent = 'nodes-connection-line'
const mockAddNewNodeButtonContent = 'add-new-node-button'
const mockDeleteButton = 'delete-button'
const mockEditButton = 'edit-button'
const mockDraggableNodeItem = 'draggable-node-item'
const mockOnMoveButton = 'on-move-button'
const mockOnDragEndButton = 'on-drag-end-button'

const mockNode1 = new QueryNode({
  id: 'node-1',
  name: 'Node 1',
  prompt: 'Prompt 1',
})

const mockNode2 = new QueryNode({
  id: 'node-2',
  name: 'Node 2',
  prompt: 'Prompt 2',
})

const mockOnAdd = jest.fn()
const mockOnDelete = jest.fn()
const mockOnEdit = jest.fn()
const mockOnReorder = jest.fn()

const defaultProps = {
  onAdd: mockOnAdd,
  nodes: [mockNode1, mockNode2],
  onDelete: mockOnDelete,
  onEdit: mockOnEdit,
  onReorder: mockOnReorder,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders AddNewNodeButton at the beginning', () => {
  render(<NodesBuilder {...defaultProps} />)

  const addButtons = screen.getAllByText(mockAddNewNodeButtonContent)

  expect(addButtons.length).toBe(2)
})

test('renders all nodes with NodeItem components', () => {
  render(<NodesBuilder {...defaultProps} />)

  defaultProps.nodes.forEach((node) => {
    expect(screen.getByText(node.name)).toBeInTheDocument()
  })
})

test('renders NodesConnectionLine between nodes', () => {
  render(<NodesBuilder {...defaultProps} />)

  const connectionLines = screen.getAllByText(mockNodesConnectionLineContent)

  expect(connectionLines.length).toBe(1)
})

test('calls onAdd with position 0 when first AddNewNodeButton is clicked', async () => {
  render(<NodesBuilder {...defaultProps} />)

  const firstAddButton = screen.getAllByRole('button', { name: mockAddNewNodeButtonContent })[0]
  await userEvent.click(firstAddButton)

  expect(mockOnAdd).toHaveBeenCalledWith(0)
})

test('calls onAdd with correct position when last AddNewNodeButton is clicked', async () => {
  render(<NodesBuilder {...defaultProps} />)

  const lastAddButton = screen.getAllByRole('button', { name: mockAddNewNodeButtonContent })[1]
  await userEvent.click(lastAddButton)

  expect(mockOnAdd).toHaveBeenCalledWith(2)
})

test('calls onEdit with node id when NodeItem onEdit is triggered', async () => {
  render(<NodesBuilder {...defaultProps} />)

  const [editButton] = screen.getAllByRole('button', { name: mockEditButton })
  await userEvent.click(editButton)

  expect(mockOnEdit).toHaveBeenCalledWith(mockNode1)
})

test('calls onDelete with node id when NodeItem onDelete is triggered', async () => {
  render(<NodesBuilder {...defaultProps} />)

  const [deleteButton] = screen.getAllByRole('button', { name: mockDeleteButton })
  await userEvent.click(deleteButton)

  expect(mockOnDelete).toHaveBeenCalledWith([mockNode2])
})

test('passes correct prompt numbers to NodeItem components', () => {
  render(<NodesBuilder {...defaultProps} />)

  const promptNumbers = screen.getAllByTestId('prompt-number')

  expect(promptNumbers[0]).toHaveTextContent('1')
  expect(promptNumbers[1]).toHaveTextContent('2')
})

test('renders DraggableNodeItem for each node', () => {
  render(<NodesBuilder {...defaultProps} />)

  const draggableItems = screen.getAllByTestId(mockDraggableNodeItem, { exact: false })

  expect(draggableItems.length).toBe(2)
})

test('calls onReorder with reordered nodes when order changes and drag ends', async () => {
  render(<NodesBuilder {...defaultProps} />)

  const moveButton = screen.getAllByRole('button', { name: mockOnMoveButton })[0]
  await userEvent.click(moveButton)

  const dragEndButton = screen.getAllByRole('button', { name: mockOnDragEndButton })[0]
  await userEvent.click(dragEndButton)

  expect(mockOnReorder).toHaveBeenCalledWith([mockNode2, mockNode1])
})

test('does not call onReorder when order has not changed', async () => {
  render(<NodesBuilder {...defaultProps} />)

  const dragEndButton = screen.getAllByRole('button', { name: mockOnDragEndButton })[0]
  await userEvent.click(dragEndButton)

  expect(mockOnReorder).not.toHaveBeenCalled()
})
