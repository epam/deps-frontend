
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { TableCell } from './TableCell'

jest.mock('@/utils/env', () => mockEnv)

const mockText = 'Example Text'
const defaultProps = {
  text: mockText,
  showActionButton: true,
  onRemoveClick: jest.fn(),
  onAddClick: jest.fn(),
  isMappedToField: false,
}

test('shows text content', () => {
  render(<TableCell {...defaultProps} />)
  expect(screen.getByText(mockText)).toBeInTheDocument()
})

test('shows AddIcon button when header is not mapped to field', async () => {
  render(
    <TableCell
      {...defaultProps}
      isMappedToField={false}
    />,
  )

  const button = screen.getByRole('button')

  await userEvent.click(button)
  expect(defaultProps.onAddClick).toHaveBeenCalled()
})

test('shows DeleteIcon button when header is mapped to field', async () => {
  render(
    <TableCell
      {...defaultProps}
      isMappedToField={true}
    />,
  )

  const button = screen.getByRole('button')

  await userEvent.click(button)
  expect(defaultProps.onRemoveClick).toHaveBeenCalled()
})

test('does not render action button when showActionButton is false', () => {
  render(
    <TableCell
      {...defaultProps}
      showActionButton={false}
    />,
  )

  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})
