
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import React from 'react'
import { render } from '@/utils/rendererRTL'
import { usePdfSegments } from '../hooks'
import { PdfSegment, UserPage } from '../models'
import { PdfSplittingLayout } from './PdfSplittingLayout'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../services', () => ({
  PdfSplitter: {
    getSplittedFilesData: jest.fn(),
  },
}))

jest.mock('../PdfThumbnailsMap', () => ({
  PdfThumbnailsMap: () => <div data-testid={thumbnailsMapId} />,
}))

jest.mock('../PdfSegments', () => ({
  PdfSegments: () => <div data-testid={segmentsId} />,
}))

jest.mock('../hooks', () => ({
  usePdfSegments: jest.fn(() => ({
    segments: mockSegments,
  })),
}))

const mockSegments = [
  new PdfSegment({
    id: '1',
    documentTypeId: '1',
    userPages: [
      new UserPage({
        page: 0,
        segmentId: '1',
      }),
      new UserPage({
        page: 1,
        segmentId: '1',
      }),
    ],
  }),
]

const thumbnailsMapId = 'thumbnails-id'
const segmentsId = 'segments-id'

test('renders PdfSplittingLayout correctly', () => {
  const defaultProps = {
    pdfFile: new Blob(),
  }

  render(<PdfSplittingLayout {...defaultProps} />)

  const thumbnailsMap = screen.getByTestId(thumbnailsMapId)
  const segments = screen.getByTestId(segmentsId)

  expect(thumbnailsMap).toBeInTheDocument()
  expect(segments).toBeInTheDocument()
})

test('do not render segments if segments are not provided', () => {
  jest.clearAllMocks()

  usePdfSegments.mockImplementationOnce(() => ({
    segments: [],
  }))

  const defaultProps = {
    pdfFile: new Blob(),
  }

  render(<PdfSplittingLayout {...defaultProps} />)

  const segments = screen.queryByTestId(segmentsId)

  expect(segments).not.toBeInTheDocument()
})
