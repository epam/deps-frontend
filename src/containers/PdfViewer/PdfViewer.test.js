
import { mockComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileCache } from '@/services/FileCache'
import { render } from '@/utils/rendererRTL'
import { PdfViewer } from './PdfViewer'

var MockReactPdfDocument

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/selectors/navigation')

jest.mock('@/actions/documentReviewPage', () => ({
  setVisiblePdfPage: jest.fn(),
}))

const mockTask = {
  promise: Promise.resolve({
    _pdfInfo: {
      fingerprint: '9ed1467eadbab2110a0067458b6bc623',
      numPages: 9,
    },
    numPages: 9,
  }),
  destroy: jest.fn(),
}

jest.mock('pdfjs-dist', () => ({
  ...jest.requireActual('pdfjs-dist'),
  getDocument: jest.fn(() => mockTask),
  GlobalWorkerOptions: {
    workerSrc: 'mockUrl',
  },
}))

jest.mock('./initPdfWorker', () => ({
  initPdfWorker: jest.fn(),
}))

jest.mock('./PdfPage', () => mockComponent('PdfPage'))

jest.mock('react-pdf', () => {
  const actual = jest.requireActual('react-pdf')
  let capturedProps

  const MockDocument = jest.fn(({
    children,
    onLoadSuccess,
    ...props
  }) => {
    capturedProps = {
      onLoadSuccess,
      ...props,
    }

    if (onLoadSuccess && props.file) {
      Promise.resolve().then(() => {
        onLoadSuccess({ numPages: 9 })
      })
    }
    return (
      <div>
        {children}
      </div>
    )
  })

  MockDocument.getProps = () => capturedProps
  MockReactPdfDocument = MockDocument

  return {
    ...actual,
    Document: MockDocument,
  }
})

const mockExternalProps = {
  activePage: 2,
  setActivePage: jest.fn(),
  setVisiblePage: jest.fn(),
  url: 'testUrl',
  visiblePage: 2,
}

const MockPageSwitcher = () => <div data-testid={mockPageSwitcherId}>PageSwitcher</div>

const mockPageSwitcherId = 'page-switcher'

jest.mock('@/services/FileCache', () => ({
  FileCache: {
    get: jest.fn(async () => null),
    requestAndStore: jest.fn(async (urls) => ({
      [urls[0]]: 'mockBlob',
    })),
  },
}))

beforeEach(() => {
  jest.clearAllMocks()
})

const defaultProps = {
  PageSwitcher: MockPageSwitcher,
  url: 'testUrl',
  setActivePage: jest.fn(),
}

test('calls FileCache.get when component mounts', async () => {
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    expect(FileCache.get).toHaveBeenCalledWith(mockExternalProps.url)
  })
})

test('calls FileCache.requestAndStore when FileCache.get returns null', async () => {
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    expect(FileCache.requestAndStore).toHaveBeenCalledWith([mockExternalProps.url])
  })
})

test('shows loading spinner while fetching PDF', async () => {
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    const spinner = screen.getByTestId('spin')
    expect(spinner).toBeInTheDocument()
  })
})

test('renders Document component with file when PDF is fetched', async () => {
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    const props = MockReactPdfDocument.getProps()
    expect(props.file).toBe('mockBlob')
  })
})

test('renders Document component with null file when PDF file is null', async () => {
  FileCache.requestAndStore.mockResolvedValueOnce({ [mockExternalProps.url]: null })
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    const props = MockReactPdfDocument.getProps()
    expect(props.file).toBeNull()
  })
})

test('renders PDF pages after successful load', async () => {
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    const page = screen.getByText('PdfPage')
    expect(page).toBeInTheDocument()
  })
})

test('uses cached file and skips requestAndStore when cache hit', async () => {
  const mockPdfBlob = 'cachedPdfBlob'
  FileCache.get.mockResolvedValueOnce(mockPdfBlob)

  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    expect(FileCache.get).toHaveBeenCalledWith(mockExternalProps.url)
  })

  expect(FileCache.requestAndStore).not.toHaveBeenCalled()
})

test('sets binaryPdfFile from cached data', async () => {
  const mockPdfBlob = 'cachedPdfBlob'
  FileCache.get.mockResolvedValueOnce(mockPdfBlob)

  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    expect(FileCache.get).toHaveBeenCalledWith(mockExternalProps.url)
  })
})

test('renders controls when PDF loads successfully', async () => {
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getByTestId(mockPageSwitcherId)).toBeInTheDocument()
  })
})

test('rotates PDF left when rotate left button is clicked', async () => {
  const user = userEvent.setup()
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(2)
  })

  const [rotateLeftButton] = screen.getAllByRole('button')

  await user.click(rotateLeftButton)

  const documentProps = MockReactPdfDocument.getProps()
  expect(documentProps.rotate).toBe(270)
})

test('rotates PDF right when rotate right button is clicked', async () => {
  const user = userEvent.setup()
  render(<PdfViewer {...defaultProps} />)

  await waitFor(() => {
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(2)
  })

  const [, rotateRightButton] = screen.getAllByRole('button')

  await user.click(rotateRightButton)

  const documentProps = MockReactPdfDocument.getProps()
  expect(documentProps.rotate).toBe(90)
})
