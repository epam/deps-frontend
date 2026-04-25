
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { KeyValuePairInsightsComparison } from './KeyValuePairInsightsComparison'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/hooks/useExpandableText', () => ({
  useExpandableText: () => ({
    ExpandableContainer: ({ children }) => <div data-testid="expandable-container">{children}</div>,
    ToggleExpandIcon: () => <div data-testid="toggle-icon" />,
  }),
}))

jest.mock('./KeyValuePairInsightsComparison.styles', () => ({
  ...jest.requireActual('./KeyValuePairInsightsComparison.styles'),
  FieldWrapper: ({ children, $borderColor }) => (
    <div
      data-testid="field-wrapper"
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
    value: {
      key: 'testKey',
      value: 'testValue',
    },
    borderColor: '#ff0000',
  }
})

test('renders key and value correctly', () => {
  render(<KeyValuePairInsightsComparison {...defaultProps} />)

  expect(screen.getByText('testKey')).toBeInTheDocument()
  expect(screen.getByText('testValue')).toBeInTheDocument()
})

test('renders two expandable containers for key and value', () => {
  render(<KeyValuePairInsightsComparison {...defaultProps} />)

  const expandableContainers = screen.getAllByTestId('expandable-container')
  expect(expandableContainers).toHaveLength(2)
})

test('renders two toggle expand icons', () => {
  render(<KeyValuePairInsightsComparison {...defaultProps} />)

  const toggleIcons = screen.getAllByTestId('toggle-icon')
  expect(toggleIcons).toHaveLength(2)
})

test('renders correctly with different border colors', () => {
  defaultProps.borderColor = '#00ff00'

  render(<KeyValuePairInsightsComparison {...defaultProps} />)

  const fieldWrappers = screen.getAllByTestId('field-wrapper')

  fieldWrappers.forEach((wrapper) => {
    expect(wrapper).toHaveStyle(`border-bottom: 0.2rem solid ${defaultProps.borderColor}`)
  })
})

test('renders FieldAlias when alias is provided', () => {
  const props = {
    ...defaultProps,
    alias: 'Test Alias',
  }

  render(<KeyValuePairInsightsComparison {...props} />)

  expect(screen.getByText('Test Alias')).toBeInTheDocument()
  expect(screen.getByText('testKey')).toBeInTheDocument()
  expect(screen.getByText('testValue')).toBeInTheDocument()
})

test('does not render FieldAlias when alias is not provided', () => {
  render(<KeyValuePairInsightsComparison {...defaultProps} />)

  const aliasElements = screen.queryByTestId(longTextId)
  expect(aliasElements).not.toBeInTheDocument()
})
