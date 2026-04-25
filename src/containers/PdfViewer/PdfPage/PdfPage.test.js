
import { mockEnv } from '@/mocks/mockEnv'
import { waitForElementToBeRemoved, screen, waitFor } from '@testing-library/react'
import { useInView } from 'react-intersection-observer'
import { UiKeys } from '@/constants/navigation'
import { Point } from '@/models/Point'
import { uiSelector } from '@/selectors/navigation'
import { highlightedFieldSelector } from '@/selectors/reviewPage'
import { render } from '@/utils/rendererRTL'
import { PdfPage } from './PdfPage'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('pdfjs-dist', () => ({
  ...jest.requireActual('pdfjs-dist'),
  AnnotationMode: '',
  GlobalWorkerOptions: {
    workerSrc: 'mockUrl',
  },
}))

jest.mock('@/selectors/navigation')
jest.mock('@/selectors/reviewPage')

const mockPdf = {
  getPage: jest.fn(async () => ({
    view: [0, 0, 100, 100],
    height: 100,
    width: 100,
    cleanup: jest.fn(),
    render: jest.fn(() => ({
      promise: Promise.resolve(),
    })),
    getViewport: jest.fn(() => ({
      width: 100,
      height: 100,
    })),
  })),
}

jest.mock('react-pdf', () => {
  const ActualReactPdf = jest.requireActual('react-pdf')
  const mockRequiredProps = {
    renderAnnotationLayer: false,
    renderTextLayer: false,
    rotate: 90,
  }
  return {
    ...ActualReactPdf,
    Page: (props) => (
      <ActualReactPdf.Page
        {...props}
        {...mockRequiredProps}
        pdf={mockPdf}
      />
    ),
  }
})

const mockScrollIntoView = jest.fn()

HTMLDivElement.prototype.scrollIntoView = mockScrollIntoView

const mockImageData = {
  data: [255, 255, 255],
  width: 100,
  height: 100,
}

const mockFillText = jest.fn()

const mockGetContext = jest.fn(() => ({
  font: '10px sans-serif',
  getImageData: jest.fn(() => mockImageData),
  putImageData: jest.fn(),
  measureText: jest.fn(() => ({ width: 100 })),
  fillText: mockFillText,
}))

HTMLCanvasElement.prototype.getContext = mockGetContext

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => ({
    ref: jest.fn(),
    inView: false,
  })),
}))

jest.mock('@/hocs/withParentSize', () => ({
  withFlexibleParentSize: () => (Component) => Component,
}))

const mockDrawPolygons = jest.fn()

jest.mock('@/components/ImageViewer/Canvas/useCanvasPolygons', () => ({
  useCanvasPolygons: jest.fn(() => ({
    drawPolygons: mockDrawPolygons,
  })),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

const commonDefaultProps = {
  getPdfSpaceArea: jest.fn(() => 1000),
  pageNumber: 1,
  setVisiblePage: jest.fn(),
  size: {
    width: 100,
    height: 100,
  },
  scale: 1.1,
}

test('should call scrollIntoView if component is mounted, page in view, active page is equal to pageNumber and there is no highlighted field', async () => {
  highlightedFieldSelector.mockImplementationOnce(() => null)

  render(<PdfPage {...commonDefaultProps} />)

  await waitFor(() => {
    expect(mockScrollIntoView).nthCalledWith(1, {
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    })
  })
})

test('should not call scrollIntoView when component is mounted and pageNumber is not equal to active page', async () => {
  const defaultProps = {
    ...commonDefaultProps,
    pageNumber: 100500,
  }

  render(<PdfPage {...defaultProps} />)
  await waitFor(() => {
    expect(mockScrollIntoView).not.toHaveBeenCalled()
  })
})

test('should render Loading', async () => {
  const defaultProps = {
    ...commonDefaultProps,
    pageNumber: 100500,
  }

  render(<PdfPage {...defaultProps} />)

  const loading = screen.getByText('Loading page…')

  await waitFor(() => {
    expect(loading).toBeInTheDocument()
  })
})

test('should render canvas page', async () => {
  const defaultProps = {
    ...commonDefaultProps,
    pageNumber: 100500,
  }

  const { container } = render(<PdfPage {...defaultProps} />)

  const loading = screen.getByText('Loading page…')

  await waitForElementToBeRemoved(loading)

  expect(container).toMatchSnapshot()
})

test('should call setVisiblePage prop when component is updated', async () => {
  const defaultProps = {
    ...commonDefaultProps,
    pageNumber: 100500,
  }

  const { rerender } = render(<PdfPage {...defaultProps} />)

  const loading = screen.getByText('Loading page…')

  await waitForElementToBeRemoved(loading)

  useInView.mockImplementationOnce(() => ({
    ref: jest.fn(),
    inView: true,
  }))

  rerender(<PdfPage {...defaultProps} />)

  await waitFor(() => {
    expect(defaultProps.setVisiblePage).nthCalledWith(1, defaultProps.pageNumber)
  })
})

const expectedViewPositionToPoint = new Map([
  [['start', 'start'], new Point(0.1, 0.1)],
  [['start', 'center'], new Point(0.1, 0.5)],
  [['start', 'end'], new Point(0.1, 0.9)],
  [['center', 'start'], new Point(0.5, 0.1)],
  [['center', 'center'], new Point(0.5, 0.5)],
  [['center', 'end'], new Point(0.5, 0.9)],
  [['end', 'start'], new Point(0.9, 0.1)],
  [['end', 'center'], new Point(0.9, 0.5)],
  [['end', 'end'], new Point(0.9, 0.9)],
])

for (const [[expectedInline, expectedBlock], point] of expectedViewPositionToPoint.entries()) {
  test(
    `should call scrollIntoView with expected block: ${expectedBlock} and inline: ${expectedInline} when pageNumber is equal to active page`,
    async () => {
      const defaultProps = {
        ...commonDefaultProps,
        pageNumber: 303,
      }

      uiSelector.mockImplementation(() => ({
        [UiKeys.ACTIVE_PAGE]: 303,
      }))

      highlightedFieldSelector.mockImplementation(() => [
        [point],
      ])

      const { rerender } = render(<PdfPage {...defaultProps} />)

      rerender(<PdfPage {...defaultProps} />)

      await waitFor(() => {
        expect(mockScrollIntoView).nthCalledWith(1,
          {
            behavior: 'smooth',
            block: expectedBlock,
            inline: expectedInline,
          },
        )
      })
    })
}

test('should call drawPolygons with correct size when pageNumber is equal to active page and highlightedField is provided', async () => {
  const defaultProps = {
    ...commonDefaultProps,
    pageNumber: 1,
  }

  uiSelector.mockImplementation(() => ({
    [UiKeys.ACTIVE_PAGE]: 1,
  }))

  highlightedFieldSelector.mockImplementation(() => [
    [new Point(0.5, 0.5)],
  ])

  const { rerender } = render(<PdfPage {...defaultProps} />)

  const loading = screen.getByText('Loading page…')
  await waitForElementToBeRemoved(loading)

  rerender(<PdfPage {...defaultProps} />)

  await waitFor(() => {
    expect(mockDrawPolygons).nthCalledWith(1, 100, 100)
  })
})

test('should call fillText with correct arguments in case all image data is 255', async () => {
  const defaultProps = {
    ...commonDefaultProps,
    pageNumber: 1,
  }
  render(<PdfPage {...defaultProps} />)

  await waitFor(() => {
    expect(mockFillText).nthCalledWith(1, 'The image is blank or cannot be displayed.', 0, 50)
  })

  await waitFor(() => {
    expect(mockFillText).nthCalledWith(2, 'Contact the support team to check your PDF file.', 0, 55)
  })
})

test('should not draw polygons when canvas dimensions do not match imageRendered dimensions', async () => {
  const defaultProps = {
    ...commonDefaultProps,
    pageNumber: 1,
  }

  uiSelector.mockImplementation(() => ({
    [UiKeys.ACTIVE_PAGE]: 1,
  }))

  highlightedFieldSelector.mockImplementation(() => [
    [new Point(0.5, 0.5)],
  ])

  const mockImageDataWithDifferentSize = {
    data: [255, 255, 255],
    width: 50,
    height: 50,
  }

  mockGetContext.mockReturnValueOnce({
    font: '10px sans-serif',
    getImageData: jest.fn(() => mockImageDataWithDifferentSize),
    putImageData: jest.fn(),
    measureText: jest.fn(() => ({ width: 100 })),
    fillText: mockFillText,
  })

  const { rerender } = render(<PdfPage {...defaultProps} />)

  const loading = screen.getByText('Loading page…')
  await waitForElementToBeRemoved(loading)

  mockDrawPolygons.mockClear()

  rerender(<PdfPage {...defaultProps} />)

  await waitFor(() => {
    expect(mockDrawPolygons).not.toHaveBeenCalled()
  })
})
