
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { AddNewNodeButton } from './AddNewNodeButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./AddNewNodeButton.styles', () => ({
  ButtonWrapper: ({ onClick, children }) => (
    <button onClick={onClick}>{children}</button>
  ),
  ButtonSeparator: () => <span data-testid="separator" />,
  PlusIcon: ({ icon }) => <span data-testid="plus-icon">{icon}</span>,
}))

test('calls onClick when clicked', async () => {
  const user = userEvent.setup()
  const handleClick = jest.fn()

  render(<AddNewNodeButton onClick={handleClick} />)

  const button = screen.getByRole('button')
  await user.click(button)

  expect(handleClick).toHaveBeenCalledTimes(1)
})

test('renders icon and separators', () => {
  render(<AddNewNodeButton onClick={() => {}} />)

  expect(screen.getAllByTestId('separator')).toHaveLength(2)
  expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
})
