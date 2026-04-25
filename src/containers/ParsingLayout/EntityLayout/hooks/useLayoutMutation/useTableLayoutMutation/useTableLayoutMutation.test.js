
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useLayoutData, LAYOUT_TYPE } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { useTableLayoutMutation } from './useTableLayoutMutation'

jest.mock('@/utils/env', () => mockEnv)

const mockUpdateTable = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockUpdateFileTable = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useUpdateTableMutation: jest.fn(() => [mockUpdateTable]),
}))

jest.mock('@/apiRTK/fileLayoutApi', () => ({
  useUpdateFileTableMutation: jest.fn(() => [mockUpdateFileTable]),
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
const mockParams = {
  pageId: 'page-1',
  tableId: 'table-1',
  body: { cells: [] },
}
const mockLayoutData = {
  layoutId: mockLayoutId,
  layoutType: LAYOUT_TYPE.DOCUMENT,
  isFile: false,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns updateTable function', () => {
  const { result } = renderHook(() => useTableLayoutMutation({ isEditable: true }))

  expect(result.current.updateTable).toEqual(expect.any(Function))
})

test('calls updateTable mutation when isFile is false and isEditable is true', async () => {
  const { result } = renderHook(() => useTableLayoutMutation({ isEditable: true }))

  await result.current.updateTable(mockParams)

  expect(mockUpdateTable).toHaveBeenCalledWith({
    documentId: mockLayoutId,
    ...mockParams,
  })
})

test('calls updateFileTable mutation when isFile is true and isEditable is true', async () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    layoutType: LAYOUT_TYPE.FILE,
    isFile: true,
  })

  const { result } = renderHook(() => useTableLayoutMutation({ isEditable: true }))

  await result.current.updateTable(mockParams)

  expect(mockUpdateFileTable).toHaveBeenCalledWith({
    fileId: mockLayoutId,
    ...mockParams,
  })
})

test('does not call mutation when isEditable is false', async () => {
  const { result } = renderHook(() => useTableLayoutMutation({ isEditable: false }))

  await result.current.updateTable(mockParams)

  expect(mockUpdateTable).not.toHaveBeenCalled()
  expect(mockUpdateFileTable).not.toHaveBeenCalled()
})

test('uses correct idKey for document layout type', async () => {
  const { result } = renderHook(() => useTableLayoutMutation({ isEditable: true }))

  await result.current.updateTable(mockParams)

  expect(mockUpdateTable).toHaveBeenCalledWith({
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

  const { result } = renderHook(() => useTableLayoutMutation({ isEditable: true }))

  await result.current.updateTable(mockParams)

  expect(mockUpdateFileTable).toHaveBeenCalledWith({
    fileId: mockLayoutId,
    ...mockParams,
  })
})

test('calls unwrap on mutation result', async () => {
  const mockUnwrap = jest.fn(() => Promise.resolve({}))
  mockUpdateTable.mockReturnValueOnce({
    unwrap: mockUnwrap,
  })

  const { result } = renderHook(() => useTableLayoutMutation({ isEditable: true }))

  await result.current.updateTable(mockParams)

  expect(mockUnwrap).toHaveBeenCalled()
})
