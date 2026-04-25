
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useLayoutData } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { DocumentState } from '@/enums/DocumentState'
import { FileStatus } from '@/enums/FileStatus'
import { useImageLayoutMutation } from './useImageLayoutMutation'
import { useKeyValuePairLayoutMutation } from './useKeyValuePairLayoutMutation'
import { useLayoutMutation } from './useLayoutMutation'
import { useParagraphLayoutMutation } from './useParagraphLayoutMutation'
import { useTableLayoutMutation } from './useTableLayoutMutation'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutData: jest.fn(() => mockLayoutData),
}))

jest.mock('./useParagraphLayoutMutation', () => ({
  useParagraphLayoutMutation: jest.fn(() => ({
    updateParagraph: mockUpdateParagraph,
  })),
}))

jest.mock('./useTableLayoutMutation', () => ({
  useTableLayoutMutation: jest.fn(() => ({
    updateTable: mockUpdateTable,
  })),
}))

jest.mock('./useImageLayoutMutation', () => ({
  useImageLayoutMutation: jest.fn(() => ({
    updateImage: mockUpdateImage,
  })),
}))

jest.mock('./useKeyValuePairLayoutMutation', () => ({
  useKeyValuePairLayoutMutation: jest.fn(() => ({
    updateKeyValuePair: mockUpdateKeyValuePair,
  })),
}))

const mockUpdateParagraph = jest.fn()
const mockUpdateTable = jest.fn()
const mockUpdateImage = jest.fn()
const mockUpdateKeyValuePair = jest.fn()

const mockDocument = {
  _id: 'doc-123',
  state: DocumentState.IN_REVIEW,
}

const mockFile = {
  id: 'file-123',
  state: {
    status: FileStatus.COMPLETED,
  },
}

const mockLayoutData = {
  document: mockDocument,
  file: null,
  isFile: false,
}

beforeEach(() => {
  jest.clearAllMocks()

  mockEnv.ENV.FEATURE_DOCUMENT_LAYOUT_EDITING = true
  mockEnv.ENV.FEATURE_FILE_LAYOUT_EDITING = true
})

test('returns all mutation functions', () => {
  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(result.current.updateParagraph).toBe(mockUpdateParagraph)
  expect(result.current.updateTable).toBe(mockUpdateTable)
  expect(result.current.updateImage).toBe(mockUpdateImage)
  expect(result.current.updateKeyValuePair).toBe(mockUpdateKeyValuePair)
})

test('returns isEditable as true for document when all conditions are met', () => {
  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(result.current.isEditable).toBe(true)
})

test('returns isEditable as false for document when feature flag is disabled', () => {
  mockEnv.ENV.FEATURE_DOCUMENT_LAYOUT_EDITING = false

  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(result.current.isEditable).toBe(false)
})

test('returns isEditable as false for document when parsing type is not USER_DEFINED', () => {
  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT))

  expect(result.current.isEditable).toBe(false)
})

test('returns isEditable as false for document when state is not IN_REVIEW', () => {
  useLayoutData.mockReturnValueOnce({
    document: {
      ...mockDocument,
      state: DocumentState.COMPLETED,
    },
    file: null,
    isFile: false,
  })

  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(result.current.isEditable).toBe(false)
})

test('returns isEditable as true for file when all conditions are met', () => {
  useLayoutData.mockReturnValueOnce({
    document: null,
    file: mockFile,
    isFile: true,
  })

  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(result.current.isEditable).toBe(true)
  expect(useParagraphLayoutMutation).toHaveBeenCalledWith({ isEditable: true })
})

test('returns isEditable as false for file when feature flag is disabled', () => {
  mockEnv.ENV.FEATURE_FILE_LAYOUT_EDITING = false

  useLayoutData.mockReturnValueOnce({
    document: null,
    file: mockFile,
    isFile: true,
  })

  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(result.current.isEditable).toBe(false)
})

test('returns isEditable as false for file when parsing type is not USER_DEFINED', () => {
  useLayoutData.mockReturnValueOnce({
    document: null,
    file: mockFile,
    isFile: true,
  })

  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT))

  expect(result.current.isEditable).toBe(false)
  expect(useParagraphLayoutMutation).toHaveBeenCalledWith({ isEditable: false })
})

test('returns isEditable as true for file when status is COMPLETED', () => {
  useLayoutData.mockReturnValueOnce({
    document: null,
    file: {
      ...mockFile,
      state: {
        status: FileStatus.COMPLETED,
      },
    },
    isFile: true,
  })

  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(result.current.isEditable).toBe(true)
  expect(useParagraphLayoutMutation).toHaveBeenCalledWith({ isEditable: true })
})

test('returns isEditable as false for file in PROCESSING status', () => {
  useLayoutData.mockReturnValueOnce({
    document: null,
    file: {
      ...mockFile,
      state: {
        status: FileStatus.PROCESSING,
      },
    },
    isFile: true,
  })

  const { result } = renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(result.current.isEditable).toBe(false)
  expect(useParagraphLayoutMutation).toHaveBeenCalledWith({ isEditable: false })
})

test('calls useParagraphLayoutMutation with correct isEditable', () => {
  renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(useParagraphLayoutMutation).toHaveBeenCalledWith({ isEditable: true })
})

test('calls useTableLayoutMutation with correct isEditable', () => {
  renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(useTableLayoutMutation).toHaveBeenCalledWith({ isEditable: true })
})

test('calls useImageLayoutMutation with correct isEditable', () => {
  renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(useImageLayoutMutation).toHaveBeenCalledWith({ isEditable: true })
})

test('calls useKeyValuePairLayoutMutation with correct isEditable', () => {
  renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(useKeyValuePairLayoutMutation).toHaveBeenCalledWith({ isEditable: true })
})

test('calls mutation hooks with isEditable false when conditions are not met', () => {
  useLayoutData.mockReturnValueOnce({
    document: {
      ...mockDocument,
      state: DocumentState.COMPLETED,
    },
    file: null,
    isFile: false,
  })

  renderHook(() => useLayoutMutation(DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED))

  expect(useParagraphLayoutMutation).toHaveBeenCalledWith({ isEditable: false })
  expect(useTableLayoutMutation).toHaveBeenCalledWith({ isEditable: false })
  expect(useImageLayoutMutation).toHaveBeenCalledWith({ isEditable: false })
  expect(useKeyValuePairLayoutMutation).toHaveBeenCalledWith({ isEditable: false })
})
