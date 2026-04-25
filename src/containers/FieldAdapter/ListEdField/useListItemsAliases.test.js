
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook, act } from '@testing-library/react-hooks'
import { documentsApi } from '@/api/documentsApi'
import { FieldType } from '@/enums/FieldType'
import { DocumentTypeField } from '@/models/DocumentTypeField'
import { DocumentTypeFieldMeta, ListFieldMeta } from '@/models/DocumentTypeFieldMeta'
import { ExtractedDataField, FieldData } from '@/models/ExtractedData'
import { useFieldProps } from '../useFieldProps'
import { useListItemsAliases } from './useListItemsAliases'

jest.mock('@/api/documentsApi', () => ({
  documentsApi: {
    saveEdField: jest.fn(() => mockEdField),
    updateFieldAliases: jest.fn(),
  },
}))

jest.mock('../useFieldProps', () => ({
  useFieldProps: jest.fn(() => ({
    setField: jest.fn(),
  })),
}))

jest.mock('@/utils/env', () => mockEnv)

const mockSubFieldId = 'subFieldId'
const mockListFieldPk = 'fieldPk'
const mockDocumentId = 'documentId'
const mockAlias = 'new alias'

const mockDtField = new DocumentTypeField(
  'stringListField',
  'String List Field',
  new ListFieldMeta(FieldType.STRING, new DocumentTypeFieldMeta()),
  FieldType.LIST,
  false,
  0,
  'docTypeCode',
  mockListFieldPk,
)

const mockField = new FieldData(
  'test value 1',
  null,
  null,
  null,
  0,
  null,
  null,
  null,
  null,
  null,
  mockSubFieldId,
)

const mockEdField = new ExtractedDataField(
  mockListFieldPk,
  [
    mockField,
    new FieldData(
      'test value 2',
      null,
      null,
      null,
      1,
    ),
  ],
  null,
  {
    [mockSubFieldId]: 'Sub field 1 - Alias',
  },
)

const subField = new ExtractedDataField('subfieldPk', mockField)

test('should return expected API', async () => {
  const { result } = renderHook(
    () => useListItemsAliases(
      mockDtField,
      mockEdField,
      mockDocumentId,
    ),
  )

  const { isSaving, onSave } = result.current

  expect(isSaving).toEqual(expect.any(Boolean))
  expect(onSave).toEqual(expect.any(Function))
})

test('should call documentsApi.saveEdField with correct arguments if onSave is called', async () => {
  const { result } = renderHook(
    () => useListItemsAliases(
      mockDtField,
      mockEdField,
      mockDocumentId,
    ),
  )

  const { onSave } = result.current

  await act(async () => {
    await onSave(subField, mockAlias)
  })

  expect(documentsApi.saveEdField).toHaveBeenNthCalledWith(
    1,
    {
      aliases: mockEdField.aliases,
      data: mockEdField.data,
      fieldPk: mockListFieldPk,
      documentPk: mockDocumentId,
    },
  )
})

test('should call documentsApi.updateFieldAliases with correct arguments if onSave is called', async () => {
  const { result } = renderHook(
    () => useListItemsAliases(
      mockDtField,
      mockEdField,
      mockDocumentId,
    ),
  )

  const { onSave } = result.current

  await act(async () => {
    await onSave(subField, mockAlias)
  })

  expect(documentsApi.updateFieldAliases).toHaveBeenNthCalledWith(
    1,
    {
      documentId: mockDocumentId,
      fieldCode: mockListFieldPk,
      updatedAliases: {
        [mockSubFieldId]: mockAlias,
      },
    },
  )
})

test('should call useFieldProps.setField with correct arguments if onSave is called', async () => {
  const mockSetField = jest.fn()

  useFieldProps.mockImplementationOnce(() => ({
    setField: mockSetField,
  }))

  const { result } = renderHook(
    () => useListItemsAliases(
      mockDtField,
      mockEdField,
      mockDocumentId,
    ),
  )

  const { onSave } = result.current

  await act(async () => {
    await onSave(subField, mockAlias)
  })

  expect(mockSetField).toHaveBeenNthCalledWith(
    1,
    {
      ...mockEdField,
      aliases: { [mockSubFieldId]: mockAlias },
    },
  )
})
