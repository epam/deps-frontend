
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook, act } from '@testing-library/react-hooks'
import { FieldCalibrationProvider } from '@/containers/PromptCalibrationStudio/providers'
import { Extractor, Field, Query } from '@/containers/PromptCalibrationStudio/viewModels'
import { useFieldCalibration } from './useFieldCalibration'

jest.mock('@/utils/env', () => mockEnv)

const mockDefaultProps = {
  initialFields: [],
  initialExtractors: [new Extractor({
    id: 'default-extractor',
    name: 'Default Extractor',
    model: 'test-model',
    temperature: 0.7,
    topP: 0.9,
    groupingFactor: 1,
  })],
  setCalibrationValues: jest.fn(),
}

const wrapper = ({ children }) => (
  <FieldCalibrationProvider {...mockDefaultProps}>
    {children}
  </FieldCalibrationProvider>
)

test('retrieves the context value provided by FieldCalibrationContext', () => {
  const { result } = renderHook(() => useFieldCalibration(), { wrapper })

  expect(result.current).toEqual({
    calibrationMode: null,
    setCalibrationMode: expect.any(Function),
    activeField: null,
    setActiveField: expect.any(Function),
    fields: [],
    addField: expect.any(Function),
    updateFields: expect.any(Function),
    batchUpdateFields: expect.any(Function),
    deleteField: expect.any(Function),
    extractors: mockDefaultProps.initialExtractors,
    setExtractors: expect.any(Function),
    defaultExtractor: mockDefaultProps.initialExtractors[0],
    setFields: expect.any(Function),
    closeCalibrationMode: expect.any(Function),
    updateFieldsAndClose: expect.any(Function),
    reorderFields: expect.any(Function),
  })
})

test('allows updating calibrationMode through setCalibrationMode', () => {
  const { result } = renderHook(() => useFieldCalibration(), { wrapper })

  expect(result.current.calibrationMode).toBeNull()

  act(() => {
    result.current.setCalibrationMode('advanced')
  })

  expect(result.current.calibrationMode).toBe('advanced')
})

test('allows updating activeField through setActiveField', () => {
  const { result } = renderHook(() => useFieldCalibration(), { wrapper })

  expect(result.current.activeField).toBeNull()

  const mockField = {
    id: 'test-field',
    name: 'Test Field',
  }

  act(() => {
    result.current.setActiveField(mockField)
  })

  expect(result.current.activeField).toEqual(mockField)
})

test('allows updating fields through addField', () => {
  const { result } = renderHook(() => useFieldCalibration(), { wrapper })

  expect(result.current.fields).toEqual([])

  const mockField = new Field({
    id: 'field-1',
    name: 'Test Field',
  })

  act(() => {
    result.current.addField(mockField)
  })

  expect(result.current.fields).toEqual([mockField])
})

test('allows updating fields through updateFields', () => {
  const { result } = renderHook(() => useFieldCalibration(), { wrapper })

  expect(result.current.fields).toEqual([])

  const mockField = new Field({
    id: 'field-1',
    name: 'Test Field',
    query: new Query(),
  })

  act(() => {
    result.current.addField(mockField)
  })

  expect(result.current.fields).toEqual([mockField])

  const mockUpdatedField = {
    ...mockField,
    query: {
      ...mockField.query,
      value: 'updated value',
    },
  }

  act(() => {
    result.current.setActiveField(mockUpdatedField)
  })

  expect(result.current.activeField).toEqual(mockUpdatedField)

  act(() => {
    result.current.updateFields(mockUpdatedField)
  })

  expect(result.current.fields).toEqual([mockUpdatedField])
})

test('allows batch updating fields through batchUpdateFields', () => {
  const { result } = renderHook(() => useFieldCalibration(), { wrapper })

  const mockField1 = new Field({
    id: 'field-1',
    name: 'Test Field 1',
    query: new Query(),
  })

  const mockField2 = new Field({
    id: 'field-2',
    name: 'Test Field 2',
    query: new Query(),
  })

  act(() => {
    result.current.addField(mockField1)
  })

  act(() => {
    result.current.addField(mockField2)
  })

  expect(result.current.fields).toHaveLength(2)

  const updatedFieldsMap = {
    'field-1': {
      ...mockField1,
      name: 'Updated Field 1',
    },
    'field-2': {
      ...mockField2,
      name: 'Updated Field 2',
    },
  }

  act(() => {
    result.current.batchUpdateFields(updatedFieldsMap)
  })

  expect(result.current.fields[0].name).toBe('Updated Field 1')
  expect(result.current.fields[1].name).toBe('Updated Field 2')
})

test('allows reordering fields through reorderFields', () => {
  const { result } = renderHook(() => useFieldCalibration(), { wrapper })

  expect(result.current.fields).toEqual([])

  const mockField1 = new Field({
    id: 'field-1',
    name: 'Test Field 1',
  })

  const mockField2 = new Field({
    id: 'field-2',
    name: 'Test Field 2',
  })

  act(() => {
    result.current.addField(mockField1)
  })

  act(() => {
    result.current.addField(mockField2)
  })

  expect(result.current.fields).toHaveLength(2)

  const reorderedFields = [mockField2, mockField1]

  act(() => {
    result.current.reorderFields(reorderedFields)
  })

  expect(result.current.fields).toEqual(reorderedFields)
})
