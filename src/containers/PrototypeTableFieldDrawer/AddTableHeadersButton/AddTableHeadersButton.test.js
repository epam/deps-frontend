
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { AddTableHeadersButton } from './AddTableHeadersButton'

jest.mock('@/utils/env', () => mockEnv)

test('calls onClick prop when user clicks on the button', async () => {
  const mockOnClick = jest.fn()
  const mockTitle = 'mockTitle'

  render(
    <AddTableHeadersButton
      onClick={mockOnClick}
      title={mockTitle}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockTitle,
  })

  await userEvent.click(button)

  expect(mockOnClick).toHaveBeenCalled()
})

test('disables button when disabled prop is true', async () => {
  const mockTitle = 'mockTitle'

  render(
    <AddTableHeadersButton
      disabled={true}
      onClick={jest.fn()}
      title={mockTitle}
    />,
  )

  const button = screen.getByRole('button', {
    name: mockTitle,
  })

  expect(button).toBeDisabled()
})
