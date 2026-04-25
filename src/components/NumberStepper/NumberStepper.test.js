
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { NumberStepper } from './NumberStepper'

jest.mock('@/utils/env', () => mockEnv)

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders input and buttons', () => {
  const mockValue = 5

  render(
    <NumberStepper
      onChange={jest.fn()}
      value={mockValue}
    />,
  )

  expect(screen.getByDisplayValue(mockValue)).toBeInTheDocument()
  expect(screen.getAllByRole('button')).toHaveLength(2)
})

test('calls onChange when value is incremented', async () => {
  const onChange = jest.fn()

  render(
    <NumberStepper
      onChange={onChange}
      value={5}
    />,
  )

  const [, incrementBtn] = screen.getAllByRole('button')

  await userEvent.click(incrementBtn)
  expect(onChange).toHaveBeenCalledWith(6)
})

test('calls onChange when value is decremented', async () => {
  const onChange = jest.fn()

  render(
    <NumberStepper
      onChange={onChange}
      value={5}
    />,
  )

  const [decrementBtn] = screen.getAllByRole('button')

  await userEvent.click(decrementBtn)
  expect(onChange).toHaveBeenCalledWith(4)
})
