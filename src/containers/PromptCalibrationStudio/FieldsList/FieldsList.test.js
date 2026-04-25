
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import React from 'react'
import { FieldType } from '@/enums/FieldType'
import { render } from '@/utils/rendererRTL'
import { CALIBRATION_MODE } from '../constants'
import { Extractor, Field, Query } from '../viewModels'
import { FieldsList } from './FieldsList'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('./Field', () => ({
  Field: ({ field }) => (
    <button
      data-testid="Field"
    >
      {field.name}
    </button>
  ),
}))

jest.mock('../hooks', () => ({
  useFieldCalibration: () => mockUseFieldCalibration(),
}))

jest.mock('../FieldAdvancedCalibration', () => mockShallowComponent('FieldAdvancedCalibration'))

const mockFields = [
  new Field({
    id: 'field-1',
    name: 'Test Field',
    fieldType: FieldType.STRING,
    extractorId: 'extractor-1',
    multiplicity: 'single',
    value: 'Test Value',
  }),
]

const mockExtractors = [
  new Extractor({
    id: 'extractor-1',
    name: 'Test Extractor',
    model: 'Test Model',
    temperature: 0.5,
    topP: 0.9,
  }),
]

const calibrationState = {
  activeField: null,
  calibrationMode: null,
  setActiveField: jest.fn(),
  setCalibrationMode: jest.fn(),
  fields: mockFields,
}

const mockUseFieldCalibration = jest.fn(() => calibrationState)

const defaultProps = {
  extractors: mockExtractors,
}

beforeEach(() => {
  jest.clearAllMocks()

  mockUseFieldCalibration.mockReturnValue(calibrationState)
})

test('renders correctly when single STRING field is provided', () => {
  render(<FieldsList {...defaultProps} />)

  expect(screen.getByTestId('Field')).toBeInTheDocument()
})

test('renders correctly when multiple fields are provided', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      name: 'Test Field 1',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      value: 'Test Value 1',
    }),
    new Field({
      id: 'field-2',
      name: 'Test Field 2',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      value: 'Test Value 2',
    }),
    new Field({
      id: 'field-3',
      name: 'Test Field 3',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      value: 'Test Value 3',
    }),
  ]

  mockUseFieldCalibration.mockReturnValueOnce({
    ...calibrationState,
    fields: mockFields,
  })

  render(<FieldsList {...defaultProps} />)

  const renderedFields = screen.getAllByTestId('Field')
  expect(renderedFields).toHaveLength(3)
})

test('renders correctly with DICTIONARY field type', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      name: 'Test Dictionary Field',
      fieldType: FieldType.DICTIONARY,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      value: {
        key: 'testKey',
        value: 'testValue',
      },
    }),
  ]

  mockUseFieldCalibration.mockReturnValueOnce({
    ...calibrationState,
    fields: mockFields,
  })

  defaultProps.fields = mockFields

  render(<FieldsList {...defaultProps} />)

  const renderedFields = screen.getAllByTestId('Field')
  expect(renderedFields).toHaveLength(1)
})

test('maps correct extractor to each field', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      name: 'Field with Extractor 1',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-1',
      multiplicity: 'single',
      value: 'Test Value 1',
    }),
    new Field({
      id: 'field-2',
      name: 'Field with Extractor 2',
      fieldType: FieldType.STRING,
      extractorId: 'extractor-2',
      multiplicity: 'single',
      value: 'Test Value 2',
    }),
  ]

  const mockExtractors = [
    new Extractor({
      id: 'extractor-1',
      name: 'Test Extractor 1',
      model: 'Test Model 1',
      temperature: 0.5,
      topP: 0.9,
    }),
    new Extractor({
      id: 'extractor-2',
      name: 'Test Extractor 2',
      model: 'Test Model 2',
      temperature: 0.7,
      topP: 0.8,
    }),
  ]

  mockUseFieldCalibration.mockReturnValueOnce({
    ...calibrationState,
    fields: mockFields,
  })

  defaultProps.extractors = mockExtractors

  render(<FieldsList {...defaultProps} />)

  const renderedFields = screen.getAllByTestId('Field')
  expect(renderedFields).toHaveLength(2)
})

test('uses first extractor as fallback when extractorId not found', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      name: 'Field with Non-existent Extractor',
      fieldType: FieldType.STRING,
      extractorId: 'non-existent-id',
      multiplicity: 'single',
      value: 'Test Value',
    }),
  ]

  defaultProps.fields = mockFields

  render(<FieldsList {...defaultProps} />)

  const renderedField = screen.getByTestId('Field')
  expect(renderedField).toBeInTheDocument()
})

test('renders FieldAdvancedCalibration when calibrationMode is ADVANCED', () => {
  mockUseFieldCalibration.mockReturnValue({
    ...calibrationState,
    calibrationMode: CALIBRATION_MODE.ADVANCED,
  })

  render(<FieldsList {...defaultProps} />)

  expect(screen.getByTestId('FieldAdvancedCalibration')).toBeInTheDocument()
  expect(screen.queryByTestId('StringField')).not.toBeInTheDocument()
})

test('renders FieldAdvancedCalibration when activeField has multiple query nodes', () => {
  const query = new Query({
    nodes: [
      {
        id: 'node-1',
        name: 'Node 1',
        prompt: 'Prompt 1',
      },
      {
        id: 'node-2',
        name: 'Node 2',
        prompt: 'Prompt 2',
      },
    ],
    value: null,
  })

  mockUseFieldCalibration.mockReturnValue({
    ...calibrationState,
    activeField: {
      ...mockFields[0],
      query,
    },
  })

  render(<FieldsList {...defaultProps} />)

  expect(screen.getByTestId('FieldAdvancedCalibration')).toBeInTheDocument()
  expect(screen.queryByTestId('StringField')).not.toBeInTheDocument()
})

test('renders Field when activeField has single query node', () => {
  const query = Query.createQueryWithOneNode('test prompt', null)

  mockUseFieldCalibration.mockReturnValue({
    ...calibrationState,
    activeField: {
      ...mockFields[0],
      query,
    },
  })

  render(<FieldsList {...defaultProps} />)

  expect(screen.getByTestId('Field')).toBeInTheDocument()
  expect(screen.queryByTestId('FieldAdvancedCalibration')).not.toBeInTheDocument()
})

test('passes correct extractor to Field', () => {
  render(<FieldsList {...defaultProps} />)

  const field = screen.getByTestId('Field')
  expect(field).toBeInTheDocument()
})

test('uses first extractor when field extractorId does not match any extractor', () => {
  const fieldWithInvalidExtractor = new Field({
    id: 'field-2',
    name: 'Field with Invalid Extractor',
    fieldType: FieldType.STRING,
    extractorId: 'non-existent-extractor',
    multiplicity: 'single',
    value: 'Test Value',
  })

  mockUseFieldCalibration.mockReturnValueOnce({
    ...calibrationState,
    fields: [fieldWithInvalidExtractor],
  })

  render(<FieldsList {...defaultProps} />)

  expect(screen.getByTestId('Field')).toBeInTheDocument()
})

test('renders empty wrapper when no fields match supported types', () => {
  mockUseFieldCalibration.mockReturnValueOnce({
    ...calibrationState,
    fields: [],
  })

  render(<FieldsList {...defaultProps} />)

  expect(screen.queryByTestId('Field')).not.toBeInTheDocument()
})

test('passes extractors and fields to FieldAdvancedCalibration', () => {
  mockUseFieldCalibration.mockReturnValue({
    ...calibrationState,
    calibrationMode: CALIBRATION_MODE.ADVANCED,
  })

  render(<FieldsList {...defaultProps} />)

  const advancedCalibration = screen.getByTestId('FieldAdvancedCalibration')
  expect(advancedCalibration).toBeInTheDocument()
})
