
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { CheckmarkInsightsComparison } from './CheckmarkInsightsComparison'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Radio', () => ({
  ...jest.requireActual('@/components/Radio'),
  RadioGroup: ({ value, disabled, options }) => (
    <div
      data-disabled={disabled}
      data-testid="radio-group"
      data-value={value}
    >
      {
        options.map((opt, idx) => (
          <div
            key={idx}
            data-value={opt.value}
          >
            {opt.text}
          </div>
        ))
      }
    </div>
  ),
}))

jest.mock('@/components/Radio/RadioOption', () => ({
  RadioOption: class RadioOption {
    constructor ({ value, text }) {
      this.value = value
      this.text = text
    }
  },
}))

jest.mock('@/components/LongText', () => ({
  LongText: ({ text }) => <span data-testid={longTextId}>{text}</span>,
}))

const longTextId = 'long-text'

test('renders RadioGroup with value true and border color', () => {
  render(
    <CheckmarkInsightsComparison
      borderColor="green"
      value={true}
    />,
  )

  const radioGroup = screen.getByTestId('radio-group')
  expect(radioGroup).toBeInTheDocument()
  expect(radioGroup).toHaveAttribute('data-value', 'true')
  expect(radioGroup).toHaveAttribute('data-disabled', 'true')
})

test('renders RadioGroup with value false and border color', () => {
  render(
    <CheckmarkInsightsComparison
      borderColor="green"
      value={false}
    />,
  )

  const radioGroup = screen.getByTestId('radio-group')
  expect(radioGroup).toBeInTheDocument()
  expect(radioGroup).toHaveAttribute('data-value', 'false')
  expect(radioGroup).toHaveAttribute('data-disabled', 'true')
})

test('renders RadioGroup with null value', () => {
  render(
    <CheckmarkInsightsComparison
      borderColor="green"
      value={null}
    />,
  )

  const radioGroup = screen.getByTestId('radio-group')
  expect(radioGroup).toBeInTheDocument()
  expect(radioGroup).toHaveAttribute('data-disabled', 'true')
})

test('renders FieldAlias when alias is provided', () => {
  render(
    <CheckmarkInsightsComparison
      alias="Test Alias"
      borderColor="green"
      value={true}
    />,
  )

  expect(screen.getByText('Test Alias')).toBeInTheDocument()
})

test('does not render FieldAlias when alias is not provided', () => {
  render(
    <CheckmarkInsightsComparison
      borderColor="green"
      value={true}
    />,
  )

  const aliasElements = screen.queryByTestId(longTextId)
  expect(aliasElements).not.toBeInTheDocument()
})
