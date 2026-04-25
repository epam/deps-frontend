
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import { useLayoutData, LAYOUT_TYPE } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { useImageLayoutMutation } from './useImageLayoutMutation'

jest.mock('@/utils/env', () => mockEnv)

const mockUpdateImage = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

const mockUpdateFileImage = jest.fn(() => ({
  unwrap: jest.fn(() => Promise.resolve({})),
}))

jest.mock('@/apiRTK/documentLayoutApi', () => ({
  useUpdateImageMutation: jest.fn(() => [mockUpdateImage]),
}))

jest.mock('@/apiRTK/fileLayoutApi', () => ({
  useUpdateFileImageMutation: jest.fn(() => [mockUpdateFileImage]),
}))

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutData: jest.fn(() => mockLayoutData),
  LAYOUT_TYPE: {
    FILE: 'file',
    DOCUMENT: 'document',
  },
  LAYOUT_TYPE_TO_ENTITY_ID_KEY: {
    document: 'documentId',
    file: 'fileId',
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
  imageId: 'image-1',
  body: { title: 'updated title' },
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('returns updateImage function', () => {
  const { result } = renderHook(() => useImageLayoutMutation({ isEditable: true }))

  expect(result.current.updateImage).toEqual(expect.any(Function))
})

test('calls updateImage mutation when isFile is false and isEditable is true', async () => {
  const { result } = renderHook(() => useImageLayoutMutation({ isEditable: true }))

  await result.current.updateImage(mockParams)

  expect(mockUpdateImage).toHaveBeenCalledWith({
    documentId: mockLayoutId,
    ...mockParams,
  })
})

test('calls updateFileImage mutation when isFile is true and isEditable is true', async () => {
  useLayoutData.mockReturnValueOnce({
    layoutId: mockLayoutId,
    layoutType: LAYOUT_TYPE.FILE,
    isFile: true,
  })

  const { result } = renderHook(() => useImageLayoutMutation({ isEditable: true }))

  await result.current.updateImage(mockParams)

  expect(mockUpdateFileImage).toHaveBeenCalledWith({
    fileId: mockLayoutId,
    ...mockParams,
  })
})

test('does not call mutation when isEditable is false', async () => {
  const { result } = renderHook(() => useImageLayoutMutation({ isEditable: false }))

  await result.current.updateImage(mockParams)

  expect(mockUpdateImage).not.toHaveBeenCalled()
  expect(mockUpdateFileImage).not.toHaveBeenCalled()
})

test('uses correct idKey for document layout type', async () => {
  const { result } = renderHook(() => useImageLayoutMutation({ isEditable: true }))

  await result.current.updateImage(mockParams)

  expect(mockUpdateImage).toHaveBeenCalledWith({
    documentId: mockLayoutId,
    ...mockParams,
  })
})

test('uses correct idKey for file layout type', async () => {
  useLayoutData.mockReturnValue({
    layoutId: mockLayoutId,
    layoutType: LAYOUT_TYPE.FILE,
    isFile: true,
  })

  const { result } = renderHook(() => useImageLayoutMutation({ isEditable: true }))

  await result.current.updateImage(mockParams)

  expect(mockUpdateFileImage).toHaveBeenCalledWith({
    fileId: mockLayoutId,
    ...mockParams,
  })
})
