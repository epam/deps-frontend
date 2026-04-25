
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { RadioOption } from '@/components/Radio/RadioOption'
import { render } from '@/utils/rendererRTL'
import { DualToggle } from './DualToggle'

jest.mock('@/utils/env', () => mockEnv)

test('renders all options correctly', () => {
  const options = [
    new RadioOption({
      text: 'Option 1',
      value: '1',
    }),
    new RadioOption({
      text: 'Option 2',
      value: '2',
    }),
  ]

  render(
    <DualToggle
      onChange={jest.fn()}
      options={options}
      value={options[0].value}
    />,
  )

  expect(screen.getByText('Option 1')).toBeInTheDocument()
  expect(screen.getByText('Option 2')).toBeInTheDocument()
})

test('calls onChange when an option is selected', async () => {
  const onChangeMock = jest.fn()
  const options = [
    new RadioOption({
      text: 'Option 1',
      value: '1',
    }),
    new RadioOption({
      text: 'Option 2',
      value: '2',
    }),
  ]

  render(
    <DualToggle
      onChange={onChangeMock}
      options={options}
      value={options[0].value}
    />,
  )

  await userEvent.click(screen.getByText('Option 2'))
  expect(onChangeMock).toHaveBeenCalledWith('2')
})

test('handles empty options gracefully', () => {
  render(
    <DualToggle
      onChange={jest.fn()}
      options={[]}
      value={''}
    />,
  )

  expect(screen.queryByRole('radio')).not.toBeInTheDocument()
})
