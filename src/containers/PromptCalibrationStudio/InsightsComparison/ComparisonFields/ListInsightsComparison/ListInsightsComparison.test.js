
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { ListItemValue } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { render } from '@/utils/rendererRTL'
import { ListInsightsComparison } from './ListInsightsComparison'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../StringInsightsComparison', () => ({
  StringInsightsComparison: ({ value, borderColor, alias }) => (
    <div data-testid="string-insight">
      {alias && <span data-testid="string-alias">{alias}</span>}
      <span data-testid="string-value">{value}</span>
      <span data-testid="border-color">{borderColor}</span>
    </div>
  ),
}))

jest.mock('../KeyValuePairInsightsComparison', () => ({
  KeyValuePairInsightsComparison: ({ value, borderColor, alias }) => (
    <div data-testid="kvp-insight">
      {alias && <span data-testid="kvp-alias">{alias}</span>}
      <span data-testid="kvp-key">{value?.key}</span>
      <span data-testid="kvp-value">{value?.value}</span>
      <span data-testid="border-color">{borderColor}</span>
    </div>
  ),
}))

jest.mock('../CheckmarkInsightsComparison', () => ({
  CheckmarkInsightsComparison: ({ value, borderColor, alias }) => (
    <div data-testid="checkmark-insight">
      {alias && <span data-testid="checkmark-alias">{alias}</span>}
      <span data-testid="checkmark-value">{String(value)}</span>
      <span data-testid="border-color">{borderColor}</span>
    </div>
  ),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    value: [
      new ListItemValue({
        content: 'string1',
        alias: null,
      }),
      new ListItemValue({
        content: 'string2',
        alias: null,
      }),
      new ListItemValue({
        content: 'string3',
        alias: null,
      }),
    ],
    fieldType: FieldType.STRING,
    borderColor: '#ff0000',
  }
})

test('renders list of string insights when fieldType is STRING', () => {
  render(<ListInsightsComparison {...defaultProps} />)

  const stringInsights = screen.getAllByTestId('string-insight')
  expect(stringInsights).toHaveLength(3)

  const stringValues = screen.getAllByTestId('string-value')
  expect(stringValues[0]).toHaveTextContent('string1')
  expect(stringValues[1]).toHaveTextContent('string2')
  expect(stringValues[2]).toHaveTextContent('string3')
})

test('renders list of key-value pair insights when fieldType is DICTIONARY', () => {
  defaultProps.fieldType = FieldType.DICTIONARY
  defaultProps.value = [
    new ListItemValue({
      content: {
        key: 'key1',
        value: 'value1',
      },
      alias: null,
    }),
    new ListItemValue({
      content: {
        key: 'key2',
        value: 'value2',
      },
      alias: null,
    }),
  ]

  render(<ListInsightsComparison {...defaultProps} />)

  const kvpInsights = screen.getAllByTestId('kvp-insight')
  expect(kvpInsights).toHaveLength(2)

  const kvpKeys = screen.getAllByTestId('kvp-key')
  expect(kvpKeys[0]).toHaveTextContent('key1')
  expect(kvpKeys[1]).toHaveTextContent('key2')

  const kvpValues = screen.getAllByTestId('kvp-value')
  expect(kvpValues[0]).toHaveTextContent('value1')
  expect(kvpValues[1]).toHaveTextContent('value2')
})

test('passes borderColor to child components', () => {
  defaultProps.borderColor = '#00ff00'

  render(<ListInsightsComparison {...defaultProps} />)

  const borderColors = screen.getAllByTestId('border-color')
  borderColors.forEach((element) => {
    expect(element).toHaveTextContent('#00ff00')
  })
})

test('renders string insights with aliases', () => {
  defaultProps.value = [
    new ListItemValue({
      content: 'string1',
      alias: 'Alias 1',
    }),
    new ListItemValue({
      content: 'string2',
      alias: 'Alias 2',
    }),
  ]

  render(<ListInsightsComparison {...defaultProps} />)

  const stringInsights = screen.getAllByTestId('string-insight')
  expect(stringInsights).toHaveLength(2)

  const aliases = screen.getAllByTestId('string-alias')
  expect(aliases[0]).toHaveTextContent('Alias 1')
  expect(aliases[1]).toHaveTextContent('Alias 2')

  const stringValues = screen.getAllByTestId('string-value')
  expect(stringValues[0]).toHaveTextContent('string1')
  expect(stringValues[1]).toHaveTextContent('string2')
})

test('renders key-value pair insights with aliases', () => {
  defaultProps.fieldType = FieldType.DICTIONARY
  defaultProps.value = [
    new ListItemValue({
      content: {
        key: 'key1',
        value: 'value1',
      },
      alias: 'KVP Alias 1',
    }),
    new ListItemValue({
      content: {
        key: 'key2',
        value: 'value2',
      },
      alias: 'KVP Alias 2',
    }),
  ]

  render(<ListInsightsComparison {...defaultProps} />)

  const aliases = screen.getAllByTestId('kvp-alias')
  expect(aliases[0]).toHaveTextContent('KVP Alias 1')
  expect(aliases[1]).toHaveTextContent('KVP Alias 2')
})

test('renders checkmark insights with aliases', () => {
  defaultProps.fieldType = FieldType.CHECKMARK
  defaultProps.value = [
    new ListItemValue({
      content: true,
      alias: 'Bool Alias 1',
    }),
    new ListItemValue({
      content: false,
      alias: 'Bool Alias 2',
    }),
  ]

  render(<ListInsightsComparison {...defaultProps} />)

  const checkmarkInsights = screen.getAllByTestId('checkmark-insight')
  expect(checkmarkInsights).toHaveLength(2)

  const aliases = screen.getAllByTestId('checkmark-alias')
  expect(aliases[0]).toHaveTextContent('Bool Alias 1')
  expect(aliases[1]).toHaveTextContent('Bool Alias 2')

  const checkmarkValues = screen.getAllByTestId('checkmark-value')
  expect(checkmarkValues[0]).toHaveTextContent('true')
  expect(checkmarkValues[1]).toHaveTextContent('false')
})
