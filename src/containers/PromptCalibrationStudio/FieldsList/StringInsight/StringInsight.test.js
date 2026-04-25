
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { StringInsight } from './StringInsight'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/LongText', () => ({
  LongText: ({ text }) => <span data-testid={longTextId}>{text}</span>,
}))

const longTextId = 'long-text'

test('renders string value correctly', () => {
  const defaultProps = {
    value: 'test string value',
  }
  render(<StringInsight {...defaultProps} />)

  expect(screen.getByText(defaultProps.value)).toBeInTheDocument()
})

test('renders FieldAlias when alias is provided', () => {
  const defaultProps = {
    value: 'test value',
    alias: 'Test Alias',
  }
  render(<StringInsight {...defaultProps} />)

  expect(screen.getByText(defaultProps.alias)).toBeInTheDocument()
  expect(screen.getByText(defaultProps.value)).toBeInTheDocument()
})

test('does not render FieldAlias when alias is not provided', () => {
  const defaultProps = {
    value: 'test value',
  }
  render(<StringInsight {...defaultProps} />)

  const longTextElements = screen.getAllByTestId(longTextId)
  expect(longTextElements).toHaveLength(1)
  expect(longTextElements[0]).toHaveTextContent(defaultProps.value)
})
