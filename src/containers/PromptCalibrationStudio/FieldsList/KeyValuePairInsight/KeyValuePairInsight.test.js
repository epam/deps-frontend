
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { KeyValuePairValue } from '@/containers/PromptCalibrationStudio/viewModels'
import { render } from '@/utils/rendererRTL'
import { KeyValuePairInsight } from './KeyValuePairInsight'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./KeyValuePairInsight.styles', () => ({
  ...jest.requireActual('./KeyValuePairInsight.styles'),
  FieldAlias: ({ text }) => <span data-testid={fieldAliasId}>{text}</span>,
}))

const fieldAliasId = 'field-alias'

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    value: new KeyValuePairValue({
      key: 'testKey',
      value: 'testValue',
    }),
  }
})

test('renders key and value correctly', () => {
  render(<KeyValuePairInsight {...defaultProps} />)

  expect(screen.getByText('testKey')).toBeInTheDocument()
  expect(screen.getByText('testValue')).toBeInTheDocument()
})

test('renders long key and value strings', () => {
  const longKey = 'A'.repeat(200)
  const longValue = 'B'.repeat(200)

  defaultProps.value = new KeyValuePairValue({
    key: longKey,
    value: longValue,
  })

  render(<KeyValuePairInsight {...defaultProps} />)

  expect(screen.getByText(longKey)).toBeInTheDocument()
  expect(screen.getByText(longValue)).toBeInTheDocument()
})

test('renders FieldAlias when alias is provided', () => {
  const props = {
    ...defaultProps,
    alias: 'Test Alias',
  }

  render(<KeyValuePairInsight {...props} />)

  expect(screen.getByText('Test Alias')).toBeInTheDocument()
  expect(screen.getByText('testKey')).toBeInTheDocument()
  expect(screen.getByText('testValue')).toBeInTheDocument()
})

test('does not render FieldAlias when alias is not provided', () => {
  render(<KeyValuePairInsight {...defaultProps} />)

  const aliasElements = screen.queryByTestId(fieldAliasId)
  expect(aliasElements).not.toBeInTheDocument()
})
