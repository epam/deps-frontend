
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Field,
  KeyValuePairValue,
  ListItemValue,
  MULTIPLICITY,
  Query,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { useFieldCalibration } from '../hooks'
import { InsightsComparison } from './InsightsComparison'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../hooks', () => ({
  useFieldCalibration: jest.fn(() => ({
    activeField: {
      id: 'field-1',
      name: 'Test Field',
      isNew: false,
    },
    setActiveField: jest.fn(),
    fields: [],
    setFields: jest.fn(),
    deleteField: jest.fn(),
  })),
}))

jest.mock('./ComparisonFields/StringInsightsComparison', () => mockShallowComponent('StringInsightsComparison'))

jest.mock('./ComparisonFields/ListInsightsComparison', () => mockShallowComponent('ListInsightsComparison'))

jest.mock('./ComparisonFields/KeyValuePairInsightsComparison', () => mockShallowComponent('KeyValuePairInsightsComparison'),
)

jest.mock('./ComparisonFields/CheckmarkInsightsComparison', () => mockShallowComponent('CheckmarkInsightsComparison'))

jest.mock('@/components/Icons/ExclamationCircleOutlinedIcon', () => ({
  ExclamationCircleOutlinedIcon: () => <div data-testid="exclamation-circle-icon" />,
}))

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()

  const mockStringField = new Field({
    id: 'field-1',
    name: 'String Field',
    fieldType: FieldType.STRING,
    value: 'Old Value',
    multiplicity: MULTIPLICITY.SINGLE,
    extractorId: 'extractor-1',
  })

  defaultProps = {
    field: mockStringField,
    executedValue: 'New Value',
  }
})

test('renders StringInsightsComparison for single STRING field type with executedValue', () => {
  render(<InsightsComparison {...defaultProps} />)

  expect(screen.getByText(localize(Localization.OLD))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.NEW))).toBeInTheDocument()
  expect(screen.getAllByTestId('StringInsightsComparison')).toHaveLength(2)
})

test('renders ListInsightsComparison for multiple STRING field type', () => {
  defaultProps.field = new Field({
    id: 'field-2',
    name: 'List String Field',
    fieldType: FieldType.STRING,
    value: [
      new ListItemValue({
        content: 'Old Value 1',
        alias: null,
      }),
      new ListItemValue({
        content: 'Old Value 2',
        alias: null,
      }),
    ],
    multiplicity: MULTIPLICITY.MULTIPLE,
    extractorId: 'extractor-1',
  })
  defaultProps.executedValue = [
    new ListItemValue({
      content: 'New Value 1',
      alias: null,
    }),
    new ListItemValue({
      content: 'New Value 2',
      alias: null,
    }),
  ]

  render(<InsightsComparison {...defaultProps} />)

  expect(screen.getByText(localize(Localization.OLD))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.NEW))).toBeInTheDocument()
  expect(screen.getAllByTestId('ListInsightsComparison')).toHaveLength(2)
})

test('renders KeyValuePairInsightsComparison for single DICTIONARY field type', () => {
  const oldValue = new KeyValuePairValue({
    key: 'oldKey',
    value: 'oldValue',
  })
  const newValue = new KeyValuePairValue({
    key: 'newKey',
    value: 'newValue',
  })

  defaultProps.field = new Field({
    id: 'field-3',
    name: 'Dictionary Field',
    fieldType: FieldType.DICTIONARY,
    value: oldValue,
    multiplicity: MULTIPLICITY.SINGLE,
    extractorId: 'extractor-1',
  })
  defaultProps.executedValue = newValue

  render(<InsightsComparison {...defaultProps} />)

  expect(screen.getByText(localize(Localization.OLD))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.NEW))).toBeInTheDocument()
  expect(screen.getAllByTestId('KeyValuePairInsightsComparison')).toHaveLength(2)
})

test('renders only old value when executedValue is empty string', () => {
  defaultProps.executedValue = ''

  render(<InsightsComparison {...defaultProps} />)

  expect(screen.queryByText(localize(Localization.OLD))).not.toBeInTheDocument()
  expect(screen.queryByText(localize(Localization.NEW))).not.toBeInTheDocument()
})

test('renders comparison when executedValue is false (checkmark field)', () => {
  defaultProps.field = new Field({
    id: 'field-checkmark',
    name: 'Checkmark Field',
    fieldType: FieldType.CHECKMARK,
    value: true,
    multiplicity: MULTIPLICITY.SINGLE,
    extractorId: 'extractor-1',
  })
  defaultProps.executedValue = false

  render(<InsightsComparison {...defaultProps} />)

  expect(screen.getByText(localize(Localization.OLD))).toBeInTheDocument()
  expect(screen.getByText(localize(Localization.NEW))).toBeInTheDocument()
  expect(screen.getAllByTestId('CheckmarkInsightsComparison')).toHaveLength(2)
})

test('passes reasoning prop to ComparisonLayout when provided', async () => {
  const reasoning = 'This value was extracted from the header section'

  useFieldCalibration.mockReturnValueOnce({
    activeField: {
      ...defaultProps.field,
      query: new Query({
        ...defaultProps.field.query,
        reasoning,
      }),
    },
  })

  render(<InsightsComparison {...defaultProps} />)

  const exclamationIcon = screen.getByTestId('exclamation-circle-icon')
  await userEvent.hover(exclamationIcon)

  await waitFor(() => {
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent(reasoning)
  })
})
