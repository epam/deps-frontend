
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import { OutputProfileFeatureSwitch } from './OutputProfileFeatureSwitch'

jest.mock('@/utils/env', () => mockEnv)

test('renders the switch as checked if the checked prop is true', () => {
  render(
    <OutputProfileFeatureSwitch
      checked={true}
      code="test-code"
      name="Test Name"
      onChange={jest.fn()}
    />,
  )
  const switcher = within(screen.getByTestId('switcher-test-code')).getByRole('switch')
  expect(switcher).toBeChecked()
})

test('renders the switch as unchecked if the checked prop is false', () => {
  render(
    <OutputProfileFeatureSwitch
      checked={false}
      code="test-code"
      name="Test Name"
      onChange={jest.fn()}
    />,
  )
  const switcher = within(screen.getByTestId('switcher-test-code')).getByRole('switch')
  expect(switcher).not.toBeChecked()
})

test('renders with the correct name', () => {
  const testName = 'Test Name'
  render(
    <OutputProfileFeatureSwitch
      checked={false}
      code="test-code"
      name={testName}
      onChange={jest.fn()}
    />,
  )
  expect(screen.getByText(testName)).toBeInTheDocument()
})

test('calls onChange with correct parameters when toggled', async () => {
  const handleChange = jest.fn()
  const testCode = 'test-code'

  render(
    <OutputProfileFeatureSwitch
      checked={false}
      code={testCode}
      name="Test Name"
      onChange={handleChange}
    />,
  )
  const switcher = within(screen.getByTestId(`switcher-${testCode}`)).getByRole('switch')
  await userEvent.click(switcher)
  expect(handleChange).toHaveBeenCalledTimes(1)
  expect(handleChange).toHaveBeenCalledWith(true, testCode)
})
