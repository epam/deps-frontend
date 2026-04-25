
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useLayoutData, LAYOUT_TYPE } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { useKeyValuePairLayoutMutation } from './useKeyValuePairLayoutMutation'

jest.mock('@/utils/env', () => mockEnv)

const mockUpdateKeyValuePair = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockUpdateFileKeyValuePair = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useUpdateKeyValuePairMutation: jest.fn(() => [mockUpdateKeyValuePair]),
}))

jest.mock('@/apiRTK/fileLayoutApi', () => ({
  useUpdateFileKeyValuePairMutation: jest.fn(() => [mockUpdateFileKeyValuePair]),
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
  keyValuePairId: 'kvp-1',
  body: {
    key: 'updated key',
    value: 'updated value',
  },
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns updateKeyValuePair function', () => {
  const { result } = renderHook(() => useKeyValuePairLayoutMutation({ isEditable: true }))

  expect(result.current.updateKeyValuePair).toEqual(expect.any(Function))
})

test('calls updateKeyValuePair mutation when isFile is false and isEditable is true', async () => {
  const { result } = renderHook(() => useKeyValuePairLayoutMutation({ isEditable: true }))

  await result.current.updateKeyValuePair(mockParams)

  expect(mockUpdateKeyValuePair).toHaveBeenCalledWith({
    documentId: mockLayoutId,
    ...mockParams,
  })
})

test('calls updateFileKeyValuePair mutation when isFile is true and isEditable is true', async () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    layoutType: LAYOUT_TYPE.FILE,
    isFile: true,
  })

  const { result } = renderHook(() => useKeyValuePairLayoutMutation({ isEditable: true }))

  await result.current.updateKeyValuePair(mockParams)

  expect(mockUpdateFileKeyValuePair).toHaveBeenCalledWith({
    fileId: mockLayoutId,
    ...mockParams,
  })
})

test('does not call mutation when isEditable is false', async () => {
  const { result } = renderHook(() => useKeyValuePairLayoutMutation({ isEditable: false }))

  await result.current.updateKeyValuePair(mockParams)

  expect(mockUpdateKeyValuePair).not.toHaveBeenCalled()
  expect(mockUpdateFileKeyValuePair).not.toHaveBeenCalled()
})

test('uses correct idKey for document layout type', async () => {
  const { result } = renderHook(() => useKeyValuePairLayoutMutation({ isEditable: true }))

  await result.current.updateKeyValuePair(mockParams)

  expect(mockUpdateKeyValuePair).toHaveBeenCalledWith({
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

  const { result } = renderHook(() => useKeyValuePairLayoutMutation({ isEditable: true }))

  await result.current.updateKeyValuePair(mockParams)

  expect(mockUpdateFileKeyValuePair).toHaveBeenCalledWith({
    fileId: mockLayoutId,
    ...mockParams,
  })
})

test('calls unwrap on mutation result', async () => {
  const mockUnwrap = jest.fn(() => Promise.resolve({}))
  mockUpdateKeyValuePair.mockReturnValueOnce({
    unwrap: mockUnwrap,
  })

  const { result } = renderHook(() => useKeyValuePairLayoutMutation({ isEditable: true }))

  await result.current.updateKeyValuePair(mockParams)

  expect(mockUnwrap).toHaveBeenCalled()
})
