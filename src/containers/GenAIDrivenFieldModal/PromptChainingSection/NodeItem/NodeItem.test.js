
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { TEST_ID } from '@/containers/GenAIDrivenFieldModal/constants'
import { render } from '@/utils/rendererRTL'
import { NodeItem } from './NodeItem'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/LongText', () => ({
  LongText: ({ text }) => <span data-testid={nodeNameTestId}>{text}</span>,
}))

const nodeNameTestId = 'node-name'

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders with given name', () => {
  const defaultProps = {
    name: 'Test Node',
    id: '123',
    onClick: jest.fn(),
    isActive: false,
    onRename: jest.fn(),
  }

  render(<NodeItem {...defaultProps} />)

  expect(screen.getByTestId(TEST_ID.NODE_ITEM)).toHaveTextContent(defaultProps.name)
})

test('calls onClick with id when node is clicked', async () => {
  const defaultProps = {
    name: 'Test Node',
    id: '123',
    onClick: jest.fn(),
    isActive: false,
    onRename: jest.fn(),
  }

  render(<NodeItem {...defaultProps} />)
  await userEvent.click(screen.getByTestId(TEST_ID.NODE_ITEM))

  expect(defaultProps.onClick).toHaveBeenCalledWith(defaultProps.id)
})

test('displays error message when provided', () => {
  const defaultProps = {
    name: 'Test Node',
    id: '123',
    onClick: jest.fn(),
    isActive: false,
    errorMessage: 'Error',
    onRename: jest.fn(),
  }

  render(<NodeItem {...defaultProps} />)

  expect(screen.getByText(defaultProps.errorMessage)).toBeInTheDocument()
})

test('shows delete button only on hover when onDelete is provided', async () => {
  const defaultProps = {
    name: 'Test Node',
    id: '123',
    onClick: jest.fn(),
    isActive: false,
    onDelete: jest.fn(),
    onRename: jest.fn(),
  }

  render(<NodeItem {...defaultProps} />)

  expect(screen.queryByTestId(TEST_ID.DELETE_NODE_BUTTON)).not.toBeInTheDocument()

  await userEvent.hover(screen.getByTestId(TEST_ID.NODE_ITEM))
  expect(screen.getByTestId(TEST_ID.DELETE_NODE_BUTTON)).toBeInTheDocument()

  await userEvent.unhover(screen.getByTestId(TEST_ID.NODE_ITEM))
  expect(screen.queryByTestId(TEST_ID.DELETE_NODE_BUTTON)).not.toBeInTheDocument()
})

test('calls onDelete with id when delete button is clicked', async () => {
  const defaultProps = {
    name: 'Test Node',
    id: '123',
    onClick: jest.fn(),
    isActive: false,
    onDelete: jest.fn(),
    onRename: jest.fn(),
  }

  render(<NodeItem {...defaultProps} />)

  await userEvent.hover(screen.getByTestId(TEST_ID.NODE_ITEM))
  await userEvent.click(screen.getByTestId(TEST_ID.DELETE_NODE_BUTTON))

  expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.id)
})

test('does not render delete button if onDelete is not passed', async () => {
  const defaultProps = {
    name: 'Test Node',
    id: '123',
    onClick: jest.fn(),
    isActive: false,
    onRename: jest.fn(),
  }

  render(<NodeItem {...defaultProps} />)

  await userEvent.hover(screen.getByTestId(TEST_ID.NODE_ITEM))
  expect(screen.queryByTestId(TEST_ID.DELETE_NODE_BUTTON)).not.toBeInTheDocument()
})

test('shows name input on double click and renames on blur', async () => {
  const defaultProps = {
    name: 'Test Node',
    id: '123',
    onClick: jest.fn(),
    isActive: false,
    onRename: jest.fn(),
  }

  const newNodeName = 'New Node Name'

  render(<NodeItem {...defaultProps} />)

  const nameElement = screen.getByTestId(nodeNameTestId)
  expect(nameElement).toHaveTextContent(defaultProps.name)

  await userEvent.dblClick(nameElement)

  const input = screen.getByDisplayValue(defaultProps.name)
  expect(input).toBeInTheDocument()

  await userEvent.clear(input)
  await userEvent.type(input, newNodeName)
  await userEvent.tab()

  expect(defaultProps.onRename).toHaveBeenCalledWith(defaultProps.id, newNodeName)
  expect(screen.queryByDisplayValue(newNodeName)).toBeNull()
})

test('resets name if editing is cancelled (empty input)', async () => {
  const defaultProps = {
    name: 'Test Node',
    id: '123',
    onClick: jest.fn(),
    isActive: false,
    onRename: jest.fn(),
  }

  render(<NodeItem {...defaultProps} />)

  const nameElement = screen.getByTestId(nodeNameTestId)
  expect(nameElement).toHaveTextContent(defaultProps.name)

  await userEvent.dblClick(nameElement)

  const input = screen.getByDisplayValue(defaultProps.name)
  await userEvent.clear(input)
  await userEvent.tab()

  expect(defaultProps.onRename).not.toHaveBeenCalled()
  expect(screen.queryByDisplayValue('')).toBeNull()
})
