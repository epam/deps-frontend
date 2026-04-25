
import { mockEnv } from '@/mocks/mockEnv'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { NodesConnectionLine } from './NodesConnectionLine'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./NodesConnectionLine.styles', () => ({
  ...jest.requireActual('./NodesConnectionLine.styles'),
  VerticalLine: () => <span>{mockVerticalLineContent}</span>,
}))

jest.mock('../AddNewNodeButton', () => ({
  AddNewNodeButton: ({ onClick }) => <button onClick={onClick}>{mockAddNewNodeButtonContent}</button>,
}))

const mockVerticalLineContent = 'vertical-line'
const mockAddNewNodeButtonContent = 'add-new-node-button'

const defaultProps = {
  onAdd: jest.fn(),
}

test('renders vertical line by default', () => {
  render(<NodesConnectionLine {...defaultProps} />)

  const verticalLine = screen.getByText(mockVerticalLineContent)
  const addNewNodeButton = screen.queryByRole('button', { name: mockAddNewNodeButtonContent })

  expect(verticalLine).toBeInTheDocument()
  expect(addNewNodeButton).toBeNull()
})

test('shows AddNewNodeButton on hover', async () => {
  render(<NodesConnectionLine {...defaultProps} />)

  const verticalLine = screen.getByText(mockVerticalLineContent)

  await userEvent.hover(verticalLine)
  expect(screen.getByRole('button', { name: mockAddNewNodeButtonContent })).toBeInTheDocument()
})

test('calls onAdd when AddNewNodeButton is clicked', async () => {
  render(<NodesConnectionLine {...defaultProps} />)

  const verticalLine = screen.getByText(mockVerticalLineContent)
  await userEvent.hover(verticalLine)

  const button = screen.getByRole('button', { name: mockAddNewNodeButtonContent })
  fireEvent.click(button)

  expect(defaultProps.onAdd).toHaveBeenCalled()
})
