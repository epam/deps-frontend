
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import React from 'react'
import { documentSelector } from '@/selectors/documentReviewPage'
import { render } from '@/utils/rendererRTL'
import { PdfSplittingButtonWrapper } from './PdfSplittingButtonWrapper'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentReviewPage')

jest.mock('../PdfSplittingButton', () => ({
  PdfSplittingButton: jest.fn(() => <div>{mockPdfSplittingContent}</div>),
}))

const mockPdfSplittingContent = 'Pdf Splitting Button'

const documentWithPdfFile = {
  ...documentSelector.getSelectorMockValue(),
  files: [
    {
      url: 'http://localhost:8000.pdf',
      blobName: 'document.pdf',
    },
  ],
}

test('renders PdfSplittingButtonWrapper correctly', () => {
  render(<PdfSplittingButtonWrapper />)

  const disabledBtn = screen.getByRole('button')

  expect(disabledBtn).toBeInTheDocument()
  expect(disabledBtn).toBeDisabled()
})

test('renders PdfSplittingButton if document file has pdf extension', () => {
  jest.clearAllMocks()

  documentSelector.mockImplementationOnce(() => documentWithPdfFile)
  documentSelector.mockImplementationOnce(() => documentWithPdfFile)

  render(<PdfSplittingButtonWrapper />)

  const splitDocumentBtn = screen.getByText(mockPdfSplittingContent)

  expect(splitDocumentBtn).toBeInTheDocument()
})
