
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { MenuItemTrigger } from './MenuItemTrigger'

jest.mock('@/utils/env', () => mockEnv)

const defaultProps = {
  onClick: jest.fn(),
  label: 'Test Label',
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders label text', () => {
  render(<MenuItemTrigger {...defaultProps} />)

  expect(screen.getByRole('button', { name: 'Test Label' })).toBeInTheDocument()
})

test('calls onClick when clicked', async () => {
  render(<MenuItemTrigger {...defaultProps} />)

  await userEvent.click(screen.getByRole('button'))

  expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
})

test('renders as disabled when disabled prop is true', () => {
  render(
    <MenuItemTrigger
      {...defaultProps}
      disabled
    />,
  )

  expect(screen.getByRole('button')).toBeDisabled()
})

test('does not call onClick when disabled', async () => {
  render(
    <MenuItemTrigger
      {...defaultProps}
      disabled
    />,
  )

  await userEvent.click(screen.getByRole('button'))

  expect(defaultProps.onClick).not.toHaveBeenCalled()
})
