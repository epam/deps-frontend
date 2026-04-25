
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useLayoutData, LAYOUT_TYPE } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { useParagraphLayoutMutation } from './useParagraphLayoutMutation'

jest.mock('@/utils/env', () => mockEnv)

const mockUpdateParagraph = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockUpdateFileParagraph = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useUpdateParagraphMutation: jest.fn(() => [mockUpdateParagraph]),
}))

jest.mock('@/apiRTK/fileLayoutApi', () => ({
  useUpdateFileParagraphMutation: jest.fn(() => [mockUpdateFileParagraph]),
}))

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutData: jest.fn(() => mockLayoutData),
  LAYOUT_TYPE_TO_ENTITY_ID_KEY: {
    document: 'documentId',
    file: 'fileId',
  },
  LAYOUT_TYPE: {
    DOCUMENT: 'document',
    FILE: 'file',
  },
}))

const mockLayoutId = 'layout-123'
const mockLayoutData = {
  layoutId: mockLayoutId,
  layoutType: LAYOUT_TYPE.DOCUMENT,
  isFile: false,
}
const mockParams = {
  pageId: 'page-1',
  paragraphId: 'paragraph-1',
  body: { content: 'updated content' },
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns updateParagraph function', () => {
  const { result } = renderHook(() => useParagraphLayoutMutation({ isEditable: true }))

  expect(result.current.updateParagraph).toEqual(expect.any(Function))
})

test('calls updateParagraph mutation when isFile is false and isEditable is true', async () => {
  const { result } = renderHook(() => useParagraphLayoutMutation({ isEditable: true }))

  await result.current.updateParagraph(mockParams)

  expect(mockUpdateParagraph).toHaveBeenCalledWith({
    documentId: mockLayoutId,
    ...mockParams,
  })
})

test('calls updateFileParagraph mutation when isFile is true and isEditable is true', async () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    layoutType: LAYOUT_TYPE.FILE,
    isFile: true,
  })

  const { result } = renderHook(() => useParagraphLayoutMutation({ isEditable: true }))

  await result.current.updateParagraph(mockParams)

  expect(mockUpdateFileParagraph).toHaveBeenCalledWith({
    fileId: mockLayoutId,
    ...mockParams,
  })
})

test('does not call mutation when isEditable is false', async () => {
  const { result } = renderHook(() => useParagraphLayoutMutation({ isEditable: false }))

  await result.current.updateParagraph(mockParams)

  expect(mockUpdateParagraph).not.toHaveBeenCalled()
  expect(mockUpdateFileParagraph).not.toHaveBeenCalled()
})

test('uses correct idKey for document layout type', async () => {
  const { result } = renderHook(() => useParagraphLayoutMutation({ isEditable: true }))

  await result.current.updateParagraph(mockParams)

  expect(mockUpdateParagraph).toHaveBeenCalledWith({
    documentId: mockLayoutId,
    ...mockParams,
  })
})

test('uses correct idKey for file layout type', async () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    layoutType: LAYOUT_TYPE.FILE,
    isFile: true,
  })

  const { result } = renderHook(() => useParagraphLayoutMutation({ isEditable: true }))

  await result.current.updateParagraph(mockParams)

  expect(mockUpdateFileParagraph).toHaveBeenCalledWith({
    fileId: mockLayoutId,
    ...mockParams,
  })
})

test('calls unwrap on mutation result', async () => {
  const mockUnwrap = jest.fn(() => Promise.resolve({}))
  mockUpdateParagraph.mockReturnValueOnce({
    unwrap: mockUnwrap,
  })

  const { result } = renderHook(() => useParagraphLayoutMutation({ isEditable: true }))

  await result.current.updateParagraph(mockParams)

  expect(mockUnwrap).toHaveBeenCalled()
})
