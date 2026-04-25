
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { StringInsightsComparison } from './StringInsightsComparison'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: () => ({
    ExpandableContainer: ({ children }) => <div data-testid="expandable-container">{children}</div>,
    ToggleExpandIcon: () => <div data-testid="toggle-icon" />,
  }),
}))

jest.mock('./StringInsightsComparison.styles', () => ({
  ...jest.requireActual('./StringInsightsComparison.styles'),
  ContentWrapper: ({ children, $borderColor }) => (
    <div
      data-testid="content-wrapper"
      style={{ borderBottom: `0.2rem solid ${$borderColor}` }}
    >
      {children}
    </div>
  ),
}))

jest.mock('@/components/LongText', () => ({
  LongText: ({ text }) => <span data-testid={longTextId}>{text}</span>,
}))

const longTextId = 'long-text'

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    value: 'Test string value',
    borderColor: '#ff0000',
  }
})

test('renders value correctly', () => {
  render(<StringInsightsComparison {...defaultProps} />)

  expect(screen.getByText('Test string value')).toBeInTheDocument()
})

test('renders expandable container', () => {
  render(<StringInsightsComparison {...defaultProps} />)

  const expandableContainer = screen.getByTestId('expandable-container')
  expect(expandableContainer).toBeInTheDocument()
})

test('renders toggle expand icon', () => {
  render(<StringInsightsComparison {...defaultProps} />)

  const toggleIcon = screen.getByTestId('toggle-icon')
  expect(toggleIcon).toBeInTheDocument()
})

test('renders correctly with different border colors', () => {
  defaultProps.borderColor = '#00ff00'

  render(<StringInsightsComparison {...defaultProps} />)

  const contentWrapper = screen.getByTestId('content-wrapper')

  expect(contentWrapper).toHaveStyle(`border-bottom: 0.2rem solid ${defaultProps.borderColor}`)
})

test('renders FieldAlias when alias is provided', () => {
  const props = {
    ...defaultProps,
    alias: 'Test Alias',
  }

  render(<StringInsightsComparison {...props} />)

  expect(screen.getByText('Test Alias')).toBeInTheDocument()
  expect(screen.getByText('Test string value')).toBeInTheDocument()
})

test('does not render FieldAlias when alias is not provided', () => {
  render(<StringInsightsComparison {...defaultProps} />)

  const aliasElements = screen.queryByTestId(longTextId)
  expect(aliasElements).not.toBeInTheDocument()
})
