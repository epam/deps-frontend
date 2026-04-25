
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import { useFetchFileUnifiedDataQuery } from '@/apiRTK/filesApi'
import { UiKeys } from '@/constants/navigation'
import { uiSelector } from '@/selectors/navigation'
import { FileCache } from '@/services/FileCache'
import { render } from '@/utils/rendererRTL'
import { FileImagePreview } from './FileImagePreview'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'test-file-id' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileUnifiedDataQuery: jest.fn(),
}))

jest.mock('@/selectors/navigation', () => ({
  uiSelector: jest.fn(),
}))

jest.mock('@/services/FileCache', () => ({
  FileCache: {
    requestAndStore: jest.fn(() => Promise.resolve()),
  },
}))

jest.mock('@/components/ImageViewer', () => mockShallowComponent('ImageViewer'))
jest.mock('@/components/Spin', () => mockShallowComponent('Spin'))
jest.mock('./FileImagePageSwitcher', () => mockShallowComponent('FileImagePageSwitcher'))
jest.mock('./FileImagePreviewHotkeys', () => mockShallowComponent('FileImagePreviewHotkeys'))

const mockUnifiedData = {
  1: [
    {
      id: 'source-1',
      blobName: 'blob-1.png',
    },
  ],
  2: [
    {
      id: 'source-2',
      blobName: 'blob-2.png',
    },
  ],
}

beforeEach(() => {
  jest.clearAllMocks()

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: mockUnifiedData,
    isFetching: false,
  })

  uiSelector.mockReturnValue({
    [UiKeys.ACTIVE_PAGE]: 1,
  })
})

test('renders Spin when data is fetching', () => {
  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: undefined,
    isFetching: true,
  })

  render(<FileImagePreview />)

  expect(screen.getByTestId('Spin')).toBeInTheDocument()
  expect(screen.queryByTestId('ImageViewer')).not.toBeInTheDocument()
})

test('renders Spin when imageUrl is not available', () => {
  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: null,
    isFetching: false,
  })

  render(<FileImagePreview />)

  expect(screen.getByTestId('Spin')).toBeInTheDocument()
  expect(screen.queryByTestId('ImageViewer')).not.toBeInTheDocument()
})

test('renders ImageViewer when data is loaded', async () => {
  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })
})

test('renders FileImagePreviewHotkeys when data is loaded', async () => {
  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('FileImagePreviewHotkeys')).toBeInTheDocument()
  })
})

test('passes correct props to ImageViewer', async () => {
  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  const imageViewer = screen.getByTestId('ImageViewer')
  expect(imageViewer).toHaveAttribute('data-activepage', '1')
  expect(imageViewer).toHaveAttribute('data-imageurl', expect.stringContaining('blob-1.png'))
  expect(imageViewer).toHaveAttribute('data-scaling', 'true')
})

test('uses active page from Redux state', async () => {
  uiSelector.mockReturnValue({
    [UiKeys.ACTIVE_PAGE]: 2,
  })

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  const imageViewer = screen.getByTestId('ImageViewer')
  expect(imageViewer).toHaveAttribute('data-activepage', '2')
  expect(imageViewer).toHaveAttribute('data-imageurl', expect.stringContaining('blob-2.png'))
})

test('defaults to page 1 when active page is not set in Redux state', async () => {
  uiSelector.mockReturnValue({})

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  const imageViewer = screen.getByTestId('ImageViewer')
  expect(imageViewer).toHaveAttribute('data-activepage', '1')
})

test('uses blobName from sourceId when activeSourceId is provided', async () => {
  uiSelector.mockReturnValue({
    [UiKeys.ACTIVE_PAGE]: 1,
    [UiKeys.ACTIVE_SOURCE_ID]: 'source-2',
  })

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  const imageViewer = screen.getByTestId('ImageViewer')
  expect(imageViewer).toHaveAttribute('data-imageurl', expect.stringContaining('blob-2.png'))
})

test('caches first image when FEATURE_FILE_CACHE is enabled', async () => {
  mockEnv.ENV.FEATURE_FILE_CACHE = true

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(FileCache.requestAndStore).toHaveBeenCalledWith(
      expect.arrayContaining([expect.stringContaining('blob-1.png')]),
    )
  })
})

test('caches all images after first image is cached', async () => {
  mockEnv.ENV.FEATURE_FILE_CACHE = true

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(FileCache.requestAndStore).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.stringContaining('blob-1.png'),
        expect.stringContaining('blob-2.png'),
      ]),
    )
  })
})

test('shows fetching state while caching first image', async () => {
  let resolveCaching
  const cachingPromise = new Promise((resolve) => {
    resolveCaching = resolve
  })

  FileCache.requestAndStore.mockImplementation(() => cachingPromise)

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  const imageViewerBefore = screen.getByTestId('ImageViewer')
  expect(imageViewerBefore).toHaveAttribute('data-fetching', 'true')

  resolveCaching()

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toHaveAttribute('data-fetching', 'false')
  })
})

test('does not cache images when FEATURE_FILE_CACHE is disabled', async () => {
  mockEnv.ENV.FEATURE_FILE_CACHE = false

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(FileCache.requestAndStore).toHaveBeenCalledTimes(2)
  })

  expect(FileCache.requestAndStore).toHaveBeenCalledWith(
    expect.arrayContaining([expect.stringContaining('blob-1.png')]),
  )
})

test('passes renderPageSwitcher to ImageViewer that renders FileImagePageSwitcher', async () => {
  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  const imageViewer = screen.getByTestId('ImageViewer')
  expect(imageViewer).toHaveAttribute('data-renderpageswitcher', 'mock-renderPageSwitcher')
})

test('passes correct pagesQuantity to FileImagePageSwitcher', async () => {
  const mockUnifiedDataThreePages = {
    1: [
      {
        id: 'source-1',
        blobName: 'blob-1.png',
      },
    ],
    2: [
      {
        id: 'source-2',
        blobName: 'blob-2.png',
      },
    ],
    3: [
      {
        id: 'source-3',
        blobName: 'blob-3.png',
      },
    ],
  }

  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: mockUnifiedDataThreePages,
    isFetching: false,
  })

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })
})

test('calls FileCache.requestAndStore after initial mount', async () => {
  mockEnv.ENV.FEATURE_FILE_CACHE = false
  FileCache.requestAndStore.mockClear()

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(FileCache.requestAndStore).toHaveBeenCalled()
  })

  expect(FileCache.requestAndStore).toHaveBeenCalledWith(
    expect.arrayContaining([expect.stringContaining('blob-1.png')]),
  )
})

test('handles missing blobName in unified data', () => {
  useFetchFileUnifiedDataQuery.mockReturnValue({
    data: {
      1: [
        {
          id: 'source-1',
        },
      ],
    },
    isFetching: false,
  })

  render(<FileImagePreview />)

  expect(screen.getByTestId('Spin')).toBeInTheDocument()
  expect(screen.queryByTestId('ImageViewer')).not.toBeInTheDocument()
})

test('passes scaling prop as true to ImageViewer', async () => {
  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  const imageViewer = screen.getByTestId('ImageViewer')
  expect(imageViewer).toHaveAttribute('data-scaling', 'true')
})

test('renders ImageViewer with correct fetching prop when not caching', async () => {
  mockEnv.ENV.FEATURE_FILE_CACHE = false
  FileCache.requestAndStore.mockResolvedValue()

  render(<FileImagePreview />)

  await waitFor(() => {
    expect(screen.getByTestId('ImageViewer')).toBeInTheDocument()
  })

  const imageViewer = screen.getByTestId('ImageViewer')
  expect(imageViewer).toHaveAttribute('data-fetching', 'false')
})
