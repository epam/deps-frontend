
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { createDocumentType } from '@/api/documentTypesApi'
import { EXPORT_FIELDS, EXPORTABLE_EXTRACTION_TYPES } from '@/constants/documentType'
import { ExtractionType } from '@/enums/ExtractionType'
import { mockDocumentTypeData } from '../__mocks__/mockDocumentTypeData'
import { useCreateDocumentType } from './useCreateDocumentType'

jest.mock('@/utils/env', () => mockEnv)

const mockCreatePrototype = jest.fn(() => ({
  unwrap: () => Promise.resolve(mockCreatePrototypeResponse),
}))

jest.mock('@/api/documentTypesApi', () => ({
  createDocumentType: jest.fn(() => mockCreateDocumentTypeResponse),
}))

jest.mock('@/apiRTK/prototypesApi', () => ({
  useCreatePrototypeMutation: jest.fn(() => ([mockCreatePrototype])),
}))

const mockCreatePrototypeResponse = { id: 'mockPrototypeId' }
const mockCreateDocumentTypeResponse = { documentTypeId: 'mockDocumentTypeId' }

const defaultProps = {
  documentTypeDataRef: {
    current: mockDocumentTypeData,
  },
  increaseRequestCount: jest.fn(),
}

test('hook returns correct values', () => {
  const { result } = renderHook(() => useCreateDocumentType(defaultProps))

  const { CREATE_DOCUMENT_TYPE_REQUEST } = result.current

  expect(Object.keys(CREATE_DOCUMENT_TYPE_REQUEST)).toEqual(EXPORTABLE_EXTRACTION_TYPES)

  expect(CREATE_DOCUMENT_TYPE_REQUEST).toEqual({
    [ExtractionType.PROTOTYPE]: expect.any(Function),
    [ExtractionType.AI_PROMPTED]: expect.any(Function),
  })
})

test('calls createPrototype with correct arguments on Prototype creation', () => {
  const props = {
    ...defaultProps,
    documentTypeDataRef: {
      current: {
        ...mockDocumentTypeData,
        [EXPORT_FIELDS.EXTRACTION_TYPE]: ExtractionType.PROTOTYPE,
      },
    },
  }

  const { result } = renderHook(() => useCreateDocumentType(props))

  const { CREATE_DOCUMENT_TYPE_REQUEST } = result.current
  const request = CREATE_DOCUMENT_TYPE_REQUEST[ExtractionType.PROTOTYPE]
  request()

  expect(mockCreatePrototype).nthCalledWith(
    1,
    {
      name: mockDocumentTypeData.name,
      engine: mockDocumentTypeData.engine,
      language: mockDocumentTypeData.language,
      description: mockDocumentTypeData.description,
    },
  )
})

test('calls createDocumentType with correct arguments on Ai-Prompted document type creation', () => {
  const props = {
    ...defaultProps,
    documentTypeDataRef: {
      current: {
        ...mockDocumentTypeData,
        [EXPORT_FIELDS.EXTRACTION_TYPE]: ExtractionType.AI_PROMPTED,
      },
    },
  }

  const { result } = renderHook(() => useCreateDocumentType(props))

  const { CREATE_DOCUMENT_TYPE_REQUEST } = result.current
  const request = CREATE_DOCUMENT_TYPE_REQUEST[ExtractionType.AI_PROMPTED]
  request()

  expect(createDocumentType).nthCalledWith(1, {
    name: mockDocumentTypeData.name,
    extractorType: ExtractionType.AI_PROMPTED,
  })
})

test('calls increaseRequestCount after document type creation', () => {
  const { result } = renderHook(() => useCreateDocumentType(defaultProps))

  const { CREATE_DOCUMENT_TYPE_REQUEST } = result.current
  const request = CREATE_DOCUMENT_TYPE_REQUEST[mockDocumentTypeData.extractionType]
  request()

  expect(defaultProps.increaseRequestCount).toHaveBeenCalled()
})
