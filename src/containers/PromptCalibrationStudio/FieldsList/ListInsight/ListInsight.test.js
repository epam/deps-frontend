
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { ListItemValue } from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { render } from '@/utils/rendererRTL'
import { ListInsight } from './ListInsight'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/PromptCalibrationStudio/FieldsList/StringInsight', () => ({
  StringInsight: ({ value, alias }) => (
    <div data-testid="StringInsight">
      {alias && <span>{alias}</span>}
      {value}
    </div>
  ),
}))
jest.mock('@/containers/PromptCalibrationStudio/FieldsList/KeyValuePairInsight', () => ({
  KeyValuePairInsight: ({ value, alias }) => (
    <div data-testid="KeyValuePairInsight">
      {alias && <span>{alias}</span>}
      {value.key}
      :
      {' '}
      {value.value}
    </div>
  ),
}))
jest.mock('@/containers/PromptCalibrationStudio/FieldsList/CheckmarkInsight', () => ({
  CheckmarkInsight: ({ value, alias }) => (
    <div data-testid="CheckmarkInsight">
      {alias && <span>{alias}</span>}
      {String(value)}
    </div>
  ),
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders correctly with multiple string values', () => {
  defaultProps = {
    value: [
      new ListItemValue({
        content: 'First String',
        alias: null,
      }),
      new ListItemValue({
        content: 'Second String',
        alias: null,
      }),
      new ListItemValue({
        content: 'Third String',
        alias: null,
      }),
    ],
    fieldType: FieldType.STRING,
  }

  render(<ListInsight {...defaultProps} />)

  const stringFields = screen.getAllByTestId('StringInsight')
  expect(stringFields).toHaveLength(3)
  expect(stringFields[0]).toHaveTextContent('First String')
  expect(stringFields[1]).toHaveTextContent('Second String')
  expect(stringFields[2]).toHaveTextContent('Third String')
})

test('renders correctly with multiple dictionary values', () => {
  defaultProps = {
    value: [
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
      new ListItemValue({
        content: {
          key: 'key3',
          value: 'value3',
        },
        alias: null,
      }),
    ],
    fieldType: FieldType.DICTIONARY,
  }

  render(<ListInsight {...defaultProps} />)

  const dictionaryFields = screen.getAllByTestId('KeyValuePairInsight')
  expect(dictionaryFields).toHaveLength(3)
  expect(dictionaryFields[0]).toHaveTextContent('key1: value1')
  expect(dictionaryFields[1]).toHaveTextContent('key2: value2')
  expect(dictionaryFields[2]).toHaveTextContent('key3: value3')
})

test('renders string values with aliases', () => {
  defaultProps = {
    value: [
      new ListItemValue({
        content: 'First String',
        alias: 'Alias 1',
      }),
      new ListItemValue({
        content: 'Second String',
        alias: 'Alias 2',
      }),
    ],
    fieldType: FieldType.STRING,
  }

  render(<ListInsight {...defaultProps} />)

  const stringFields = screen.getAllByTestId('StringInsight')
  expect(stringFields).toHaveLength(2)
  expect(stringFields[0]).toHaveTextContent('Alias 1')
  expect(stringFields[0]).toHaveTextContent('First String')
  expect(stringFields[1]).toHaveTextContent('Alias 2')
  expect(stringFields[1]).toHaveTextContent('Second String')
})

test('renders dictionary values with aliases', () => {
  defaultProps = {
    value: [
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
    ],
    fieldType: FieldType.DICTIONARY,
  }

  render(<ListInsight {...defaultProps} />)

  const dictionaryFields = screen.getAllByTestId('KeyValuePairInsight')
  expect(dictionaryFields).toHaveLength(2)
  expect(dictionaryFields[0]).toHaveTextContent('KVP Alias 1')
  expect(dictionaryFields[0]).toHaveTextContent('key1: value1')
  expect(dictionaryFields[1]).toHaveTextContent('KVP Alias 2')
  expect(dictionaryFields[1]).toHaveTextContent('key2: value2')
})

test('renders checkmark values with aliases', () => {
  defaultProps = {
    value: [
      new ListItemValue({
        content: true,
        alias: 'Bool Alias 1',
      }),
      new ListItemValue({
        content: false,
        alias: 'Bool Alias 2',
      }),
    ],
    fieldType: FieldType.CHECKMARK,
  }

  render(<ListInsight {...defaultProps} />)

  const checkmarkFields = screen.getAllByTestId('CheckmarkInsight')
  expect(checkmarkFields).toHaveLength(2)
  expect(checkmarkFields[0]).toHaveTextContent('Bool Alias 1')
  expect(checkmarkFields[0]).toHaveTextContent('true')
  expect(checkmarkFields[1]).toHaveTextContent('Bool Alias 2')
  expect(checkmarkFields[1]).toHaveTextContent('false')
})
