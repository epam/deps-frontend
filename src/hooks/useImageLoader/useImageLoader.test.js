
import { mockEnv } from '@/mocks/mockEnv'
import { renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import { FileCache } from '@/services/FileCache'
import { loadImageURL } from '@/utils/image'
import { useImageLoader } from './useImageLoader'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/services/FileCache', () => ({
  FileCache: {
    requestAndStore: jest.fn(() => Promise.resolve({})),
    get: jest.fn(),
  },
}))

jest.mock('@/utils/image', () => ({
  loadImageURL: jest.fn(() => Promise.resolve(mockImage)),
}))

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    CancelToken: {
      source: jest.fn(),
    },
  },
}))

jest.mock('lodash/debounce', () => ({
  __esModule: true,
  default: jest.fn((fn) => fn),
}))

const mockImage = {
  width: 100,
  height: 100,
}

const mockImageUrl = 'http://sample.jpeg'

URL.createObjectURL = jest.fn()

test('hook returns correct values', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useImageLoader(mockImageUrl))

  await waitForNextUpdate()

  expect(result.current.image).toEqual({
    ...mockImage,
    resource: {
      ...mockImage,
    },
  })
  expect(result.current.isLoading).toBe(false)
})

test('caches an image if caching is enabled', async () => {
  const mockBlob = new Blob()
  const mockCachedData = { [mockImageUrl]: mockBlob }

  FileCache.get.mockResolvedValueOnce(null)
  FileCache.requestAndStore.mockResolvedValueOnce(mockCachedData)
  URL.createObjectURL.mockReturnValueOnce('blob:mock-url')

  const { waitForNextUpdate } = renderHook(() => useImageLoader(mockImageUrl, true))

  await waitForNextUpdate()

  expect(FileCache.requestAndStore).toHaveBeenNthCalledWith(1, [mockImageUrl])
  expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
})

test('reloads image when URL changes', async () => {
  const mockNewUrl = 'http://mock.png'
  const mockChangedImage = {
    width: 130,
    height: 150,
  }

  loadImageURL.mockResolvedValueOnce(mockImage)
  loadImageURL.mockResolvedValueOnce(mockChangedImage)

  const { result, rerender, waitForNextUpdate } = renderHook(
    ({ url }) => useImageLoader(url),
    { initialProps: { url: mockImageUrl } },
  )

  await waitForNextUpdate()
  rerender({ url: mockNewUrl })
  await waitForNextUpdate()

  expect(axios.CancelToken.source).toHaveBeenCalled()
  expect(result.current.image.width).toBe(130)
  expect(result.current.image.height).toBe(150)
})
