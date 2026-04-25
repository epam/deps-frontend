
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { render } from '@/utils/rendererRTL'
import { SettingsButton } from './SettingsButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/AngleDownIcon', () => ({
  AngleDownIcon: () => <span data-testid='angle-down-icon' />,
}))

const mockTitle = 'Button Title'
const mockRef = React.createRef()

test('renders button with correct layout', () => {
  render(
    <SettingsButton
      disabled={false}
      isActive={false}
      onClick={jest.fn()}
      title={mockTitle}
    />,
  )

  expect(screen.getByRole('button')).toHaveTextContent(mockTitle)
  expect(screen.getByTestId('angle-down-icon')).toBeInTheDocument()
})

test('disables button if disable prop is true', () => {
  render(
    <SettingsButton
      disabled={true}
      isActive={false}
      onClick={jest.fn()}
      title={mockTitle}
    />,
  )

  expect(screen.getByRole('button')).toBeDisabled()
})

test('calls onClick prop on button click', async () => {
  const mockOnClick = jest.fn()
  render(
    <SettingsButton
      disabled={false}
      isActive={false}
      onClick={mockOnClick}
      title={mockTitle}
    />,
  )

  await userEvent.click(screen.getByRole('button'))
  expect(mockOnClick).toHaveBeenCalled()
})

test('forwards ref correctly', () => {
  render(
    <SettingsButton
      ref={mockRef}
      disabled={false}
      isActive={false}
      onClick={jest.fn()}
      title={mockTitle}
    />,
  )

  const button = screen.getByRole('button')
  expect(mockRef.current).toBe(button)
})
