
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FieldType } from '@/enums/FieldType'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { PromptCalibrationStudio } from './PromptCalibrationStudio'
import { Extractor, Field } from './viewModels'

var MockAddFieldDrawer
var MockFieldsEmptyState

jest.mock('@/utils/env', () => mockEnv)
jest.mock('./AddFieldDrawer', () => {
  const mock = mockShallowComponent('AddFieldDrawer')
  MockAddFieldDrawer = mock.AddFieldDrawer
  return mock
})
jest.mock('./FieldsEmptyState', () => {
  const mock = mockShallowComponent('FieldsEmptyState')
  MockFieldsEmptyState = mock.FieldsEmptyState
  return mock
})
jest.mock('./FieldsList', () => {
  const mock = mockShallowComponent('FieldsList')
  return mock
})

jest.mock('./hooks', () => ({
  useFieldCalibration: () => mockUseFieldCalibration(),
}))

const mockUseFieldCalibration = jest.fn(() => ({
  fields: [],
  calibrationMode: null,
  addField: jest.fn(),
  extractors: [],
  setExtractors: jest.fn(),
  defaultExtractor: mockExtractor,
}))

const mockExtractor = new Extractor({
  id: 'mock-extractor-id',
  customInstruction: 'mock instructions',
  groupingFactor: 1,
  model: 'mock-model',
  name: 'Mock Extractor',
  temperature: 0.7,
  topP: 0.9,
})

const defaultProps = {
  initialFields: [],
  initialExtractors: [],
  defaultExtractor: mockExtractor,
  setCalibrationValues: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders fields header with correct text', () => {
  render(<PromptCalibrationStudio {...defaultProps} />)

  const headerText = screen.getByText(localize(Localization.FIELDS))

  expect(headerText).toBeInTheDocument()
})

test('renders FieldsEmptyState when initialFields array is empty', () => {
  mockUseFieldCalibration.mockReturnValueOnce({
    ...mockUseFieldCalibration(),
    fields: [],
  })

  render(<PromptCalibrationStudio {...defaultProps} />)

  const emptyState = screen.getByTestId('FieldsEmptyState')

  expect(emptyState).toBeInTheDocument()
})

test('does not render AddFieldDrawer when initialFields array is empty', () => {
  mockUseFieldCalibration.mockReturnValueOnce({
    ...mockUseFieldCalibration(),
    fields: [],
  })

  render(<PromptCalibrationStudio {...defaultProps} />)

  const addFieldDrawer = screen.queryByTestId('AddFieldDrawer')

  expect(addFieldDrawer).not.toBeInTheDocument()
})

test('renders AddFieldDrawer when initialFields array has items', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      extractorId: 'mock-extractor-id',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      name: 'field1',
      value: 'value1',
      type: FieldType.STRING,
    }),
  ]

  mockUseFieldCalibration.mockReturnValueOnce({
    ...mockUseFieldCalibration(),
    fields: mockFields,
  })

  render(<PromptCalibrationStudio {...defaultProps} />)

  const addFieldDrawer = screen.getByTestId('AddFieldDrawer')

  expect(addFieldDrawer).toBeInTheDocument()
})

test('renders FieldsList when initialFields array has items', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      extractorId: 'mock-extractor-id',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      name: 'field1',
      value: 'value1',
      type: FieldType.STRING,
    }),
    new Field({
      id: 'field-2',
      extractorId: 'mock-extractor-id',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      name: 'field2',
      value: 'value2',
      type: FieldType.STRING,
    }),
  ]

  mockUseFieldCalibration.mockReturnValueOnce({
    ...mockUseFieldCalibration(),
    fields: mockFields,
  })

  render(<PromptCalibrationStudio {...defaultProps} />)

  const fieldsList = screen.getByTestId('FieldsList')

  expect(fieldsList).toBeInTheDocument()
})

test('does not render FieldsEmptyState when initialFields array has items', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      extractorId: 'mock-extractor-id',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      name: 'field1',
      value: 'value1',
      type: FieldType.STRING,
    }),
    new Field({
      id: 'field-2',
      extractorId: 'mock-extractor-id',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      name: 'field2',
      value: 'value2',
      type: FieldType.STRING,
    }),
  ]

  mockUseFieldCalibration.mockReturnValueOnce({
    ...mockUseFieldCalibration(),
    fields: mockFields,
  })

  render(<PromptCalibrationStudio {...defaultProps} />)

  const emptyState = screen.queryByTestId('FieldsEmptyState')

  expect(emptyState).not.toBeInTheDocument()
})

test('renders FieldsEmptyState when initialFields prop is not provided', () => {
  render(<PromptCalibrationStudio {...defaultProps} />)

  const emptyState = screen.getByTestId('FieldsEmptyState')

  expect(emptyState).toBeInTheDocument()
})

test('does not render FieldsList when initialFields prop is not provided', () => {
  render(<PromptCalibrationStudio {...defaultProps} />)

  const fieldsList = screen.queryByTestId('FieldsList')

  expect(fieldsList).not.toBeInTheDocument()
})

test('does not render AddFieldDrawer in header when initialFields prop is not provided', () => {
  render(<PromptCalibrationStudio {...defaultProps} />)

  const addFieldDrawer = screen.queryByTestId('AddFieldDrawer')

  expect(addFieldDrawer).not.toBeInTheDocument()
})

test('passes defaultExtractor id to FieldsEmptyState', () => {
  render(<PromptCalibrationStudio {...defaultProps} />)

  const props = MockFieldsEmptyState.getProps()

  expect(props.defaultExtractorId).toBe(mockExtractor.id)
})

test('passes defaultExtractor id to AddFieldDrawer when fields exist', () => {
  const mockFields = [
    new Field({
      id: 'field-1',
      extractorId: 'mock-extractor-id',
      fieldType: FieldType.STRING,
      multiplicity: 'single',
      name: 'field1',
      value: 'value1',
    }),
  ]

  mockUseFieldCalibration.mockReturnValueOnce({
    ...mockUseFieldCalibration(),
    fields: mockFields,
  })

  render(<PromptCalibrationStudio {...defaultProps} />)

  const props = MockAddFieldDrawer.getProps()

  expect(props.defaultExtractorId).toBe(mockExtractor.id)
})
