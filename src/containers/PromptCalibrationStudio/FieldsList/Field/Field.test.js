
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { CALIBRATION_MODE } from '@/containers/PromptCalibrationStudio/constants'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import {
  Extractor,
  Field as FieldModel,
  ListItemValue,
  MULTIPLICITY,
  Query,
  QueryNode,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { Field } from './Field'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(() => mockCalibrationState),
}))

jest.mock('@/containers/PromptCalibrationStudio/FieldBaseCalibration', () => ({
  FieldBaseCalibration: ({ onClose }) => (
    <div data-testid="FieldBaseCalibration">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

jest.mock('@/containers/PromptCalibrationStudio/FieldsList/StringInsight', () => ({
  StringInsight: ({ value }) => <div data-testid="StringInsight">{value}</div>,
}))

jest.mock('@/containers/PromptCalibrationStudio/FieldsList/KeyValuePairInsight', () => ({
  KeyValuePairInsight: () => <div data-testid="KeyValuePairInsight" />,
}))

jest.mock('@/containers/PromptCalibrationStudio/FieldsList/ListInsight', () => ({
  ListInsight: () => <div data-testid="ListInsight" />,
}))

jest.mock('@/containers/PromptCalibrationStudio/FieldsList/NodesPreview', () => ({
  NodesPreview: () => <div data-testid="NodesPreview" />,
}))

jest.mock('@/components/FieldLabel', () => ({
  FieldLabel: ({ name, required }) => (
    <div data-testid="FieldLabel">
      {name}
      {required && <span data-testid="required-indicator">*</span>}
    </div>
  ),
}))

const mockFields = [
  new FieldModel({
    id: 'field-1',
    name: 'Test Field',
    fieldType: FieldType.STRING,
    extractorId: 'extractor-1',
    multiplicity: 'single',
    value: 'Test Value',
    query: new Query({
      nodes: [],
    }),
  }),
]

const mockExtractor = new Extractor({
  id: 'extractor-1',
  name: 'Test Extractor',
  model: 'Test Model',
  temperature: 0.5,
  topP: 0.9,
})

const mockCalibrationState = {
  activeField: null,
  calibrationMode: null,
  setActiveField: jest.fn(),
  setCalibrationMode: jest.fn(),
  fields: mockFields,
}

const defaultProps = {
  field: mockFields[0],
  extractor: mockExtractor,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders field name and calibrate button', () => {
  render(<Field {...defaultProps} />)

  const fieldName = screen.getByText('Test Field')
  expect(fieldName).toBeInTheDocument()

  const calibrateButton = screen.getByText(localize(Localization.CALIBRATE_PROMPT))
  expect(calibrateButton).toBeInTheDocument()
})

test('renders correct value component for single STRING field', () => {
  render(<Field {...defaultProps} />)

  const stringInsight = screen.getByTestId('StringInsight')
  expect(stringInsight).toBeInTheDocument()
})

test('renders correct value component for multiple STRING field', () => {
  const multipleStringField = new FieldModel({
    ...mockFields[0],
    multiplicity: MULTIPLICITY.MULTIPLE,
    value: [
      new ListItemValue({
        content: 'Value 1',
        alias: null,
      }),
      new ListItemValue({
        content: 'Value 2',
        alias: null,
      }),
    ],
  })

  const props = {
    ...defaultProps,
    field: multipleStringField,
  }

  render(<Field {...props} />)

  const listInsight = screen.getByTestId('ListInsight')
  expect(listInsight).toBeInTheDocument()
})

test('renders correct value component for single DICTIONARY field', () => {
  const dictionaryField = new FieldModel({
    ...mockFields[0],
    fieldType: FieldType.DICTIONARY,
    multiplicity: MULTIPLICITY.SINGLE,
    value: {
      key: 'testKey',
      value: 'testValue',
    },
  })

  const props = {
    ...defaultProps,
    field: dictionaryField,
  }

  render(<Field {...props} />)

  const keyValueInsight = screen.getByTestId('KeyValuePairInsight')
  expect(keyValueInsight).toBeInTheDocument()
})

test('renders correct value component for multiple DICTIONARY field', () => {
  const multipleDictionaryField = new FieldModel({
    ...mockFields[0],
    fieldType: FieldType.DICTIONARY,
    multiplicity: MULTIPLICITY.MULTIPLE,
    value: [
      new ListItemValue({
        content: {
          key: 'key1',
          value: 'value1',
        },
        alias: null,
      }),
    ],
  })

  const props = {
    ...defaultProps,
    field: multipleDictionaryField,
  }

  render(<Field {...props} />)

  const listInsight = screen.getByTestId('ListInsight')
  expect(listInsight).toBeInTheDocument()
})

test('renders FieldBaseCalibration when calibration mode is BASE and activeField is the same as the field', async () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    calibrationMode: CALIBRATION_MODE.BASE,
    activeField: mockFields[0],
  })

  render(<Field {...defaultProps} />)

  const baseCalibration = screen.getByTestId('FieldBaseCalibration')
  expect(baseCalibration).toBeInTheDocument()
})

test('renders nodes preview if field has nodes', () => {
  const fieldWithNodes = new FieldModel({
    ...mockFields[0],
    query: new Query({
      nodes: [
        new QueryNode({
          id: 'node-1',
          name: 'Node 1',
          prompt: 'Test prompt',
        }),
      ],
    }),
  })

  const props = {
    ...defaultProps,
    field: fieldWithNodes,
  }

  render(<Field {...props} />)

  const nodesPreview = screen.getByTestId('NodesPreview')
  expect(nodesPreview).toBeInTheDocument()
})

test('renders FieldLabel with field name', () => {
  render(<Field {...defaultProps} />)

  const fieldLabel = screen.getByTestId('FieldLabel')
  expect(fieldLabel).toBeInTheDocument()
  expect(fieldLabel).toHaveTextContent('Test Field')
})

test('renders FieldLabel without required indicator when field is not required', () => {
  const fieldNotRequired = new FieldModel({
    ...mockFields[0],
    required: false,
  })

  const props = {
    ...defaultProps,
    field: fieldNotRequired,
  }

  render(<Field {...props} />)

  const fieldLabel = screen.getByTestId('FieldLabel')
  expect(fieldLabel).toBeInTheDocument()

  const requiredIndicator = screen.queryByTestId('required-indicator')
  expect(requiredIndicator).not.toBeInTheDocument()
})

test('renders FieldLabel with required indicator when field is required', () => {
  const fieldRequired = new FieldModel({
    ...mockFields[0],
    required: true,
  })

  const props = {
    ...defaultProps,
    field: fieldRequired,
  }

  render(<Field {...props} />)

  const fieldLabel = screen.getByTestId('FieldLabel')
  expect(fieldLabel).toBeInTheDocument()

  const requiredIndicator = screen.getByTestId('required-indicator')
  expect(requiredIndicator).toBeInTheDocument()
  expect(requiredIndicator).toHaveTextContent('*')
})
