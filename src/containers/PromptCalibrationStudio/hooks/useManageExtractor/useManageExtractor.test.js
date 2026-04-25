
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import {
  Extractor,
  Field,
  Query,
  MULTIPLICITY,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { Localization, localize } from '@/localization/i18n'
import { useManageExtractor } from './useManageExtractor'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../useFieldCalibration', () => ({
  useFieldCalibration: jest.fn(() => ({
    extractors: [mockExtractor1, mockExtractor2],
    setExtractors: mockSetExtractors,
    activeField: mockField,
    setActiveField: mockSetActiveField,
    updateFields: mockUpdateFields,
  })),
}))

jest.mock('../useExtractFieldsValues', () => ({
  useExtractFieldsValues: jest.fn(() => ({
    extractFieldsValues: mockExtractFieldsValues,
    isRetrievingInsights: false,
  })),
}))

const mockExtractor1 = new Extractor({
  id: 'extractor-1',
  name: 'GPT-4 Extractor',
  model: 'gpt-4',
  customInstruction: 'Test instruction',
  groupingFactor: 5,
  temperature: 0.5,
  topP: 1,
  pageSpan: null,
})

const mockExtractor2 = new Extractor({
  id: 'extractor-2',
  name: 'Claude Extractor',
  model: 'claude-3',
  customInstruction: 'Test instruction 2',
  groupingFactor: 3,
  temperature: 0.7,
  topP: 0.9,
  pageSpan: null,
})

const mockField = new Field({
  id: 'field-1',
  name: 'Test Field',
  value: 'test value',
  extractorId: 'extractor-1',
  query: new Query({
    nodes: ['node-1', 'node-2'],
    value: 'test value',
  }),
  fieldType: FieldType.STRING,
  multiplicity: MULTIPLICITY.SINGLE,
})

const mockSetExtractors = jest.fn()
const mockSetActiveField = jest.fn()
const mockUpdateFields = jest.fn()
const mockExtractFieldsValues = jest.fn(() => Promise.resolve())

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns isRetrievingInsights from useExtractFieldsValues', () => {
  const { result } = renderHook(() => useManageExtractor())

  expect(result.current.isRetrievingInsights).toBe(false)
})

test('updateExtractorForAllFields updates extractor and calls extractFieldsValues', async () => {
  const { result } = renderHook(() => useManageExtractor())

  const formValues = {
    name: 'Updated Extractor',
    model: 'gpt-4-turbo',
    customInstruction: 'Updated instruction',
    groupingFactor: 10,
    temperature: 0.8,
    topP: 0.95,
    pageSpan: null,
  }

  const newExtractor = await result.current.updateExtractorForAllFields(formValues, mockExtractor1.id)

  expect(mockSetExtractors).toHaveBeenCalledWith([newExtractor, mockExtractor2])
  expect(mockExtractFieldsValues).toHaveBeenCalledWith(newExtractor)
})

test('updateExtractorForActiveField creates new extractor with field name', () => {
  const { result } = renderHook(() => useManageExtractor())

  const formValues = {
    model: 'gpt-4',
    customInstruction: 'Test instruction',
    groupingFactor: 5,
    temperature: 0.5,
    topP: 1,
    pageSpan: null,
  }

  const newExtractor = result.current.updateExtractorForActiveField(formValues)
  const updatedField = Field.updateExtractor(mockField, newExtractor.id)

  expect(mockSetExtractors).toHaveBeenCalledTimes(1)
  expect(mockSetActiveField).toHaveBeenCalledWith(updatedField)
  expect(mockUpdateFields).toHaveBeenCalledWith(updatedField)
  expect(newExtractor.name).toBe(localize(Localization.NAME_FOR_EXTRACTOR, { fieldName: mockField.name }))
})

test('createNewExtractor creates extractor and adds to extractors list', () => {
  const { result } = renderHook(() => useManageExtractor())

  const formValues = {
    name: 'New Extractor',
    model: 'gpt-4',
    customInstruction: 'New instruction',
    groupingFactor: 5,
    temperature: 0.5,
    topP: 1,
    pageSpan: null,
  }

  result.current.createNewExtractor(formValues)

  expect(mockSetExtractors).toHaveBeenCalledTimes(1)
})

test('updateExtractorForAllFields returns updated extractor', async () => {
  const { result } = renderHook(() => useManageExtractor())

  const formValues = {
    name: 'Updated Name',
    model: 'gpt-4',
    customInstruction: 'Updated instruction',
    groupingFactor: 7,
    temperature: 0.6,
    topP: 0.9,
    pageSpan: null,
  }

  const updatedExtractor = await result.current.updateExtractorForAllFields(formValues, mockExtractor1.id)

  expect(updatedExtractor.id).toBe(mockExtractor1.id)
  expect(updatedExtractor.name).toBe(formValues.name)
})
