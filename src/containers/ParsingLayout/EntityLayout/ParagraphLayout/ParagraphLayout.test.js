
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import React from 'react'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import {
  LineLayout,
  ParagraphLayout,
} from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { ParagraphLayout as ParagraphLayoutComponent } from './ParagraphLayout'

jest.mock('@/utils/env', () => mockEnv)

const mockLine1 = new LineLayout({
  order: 1,
  confidence: 0,
  content: 'Line 1 content',
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockLine2 = new LineLayout({
  order: 2,
  confidence: 0,
  content: 'Line 2 content',
  polygon: [
    new Point(0.555, 0.666),
    new Point(0.777, 0.888),
  ],
})

const mockParagraph1 = new ParagraphLayout({
  id: 'id1',
  order: 1,
  content: 'Paragraph 1 content',
  confidence: 0,
  role: 'role1',
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
  lines: [mockLine1],
})

const mockParagraph2 = new ParagraphLayout({
  id: 'id2',
  order: 2,
  content: 'Paragraph 2 content',
  confidence: 0,
  role: 'role2',
  polygon: [
    new Point(0.555, 0.666),
    new Point(0.777, 0.888),
  ],
  lines: [mockLine2],
})

const mockData = [
  {
    layout: mockParagraph1,
    page: 1,
    pageId: 'page-1',
  },
  {
    layout: mockParagraph2,
    page: 2,
    pageId: 'page-2',
  },
]

function MockInfiniteScrollLayout ({ setLayout, children }) {
  React.useEffect(() => {
    setLayout(mockData)
  }, [setLayout])
  return children
}

jest.mock('../InfiniteScrollLayout', () => ({
  InfiniteScrollLayout: MockInfiniteScrollLayout,
}))

jest.mock('./ParagraphField', () => ({
  ParagraphField: jest.fn(({ paragraph }) => (
    <div data-testid={paragraph.id}>
      {
        paragraph.lines.map((line, index) => (
          <span key={index}>
            {line.content}
          </span>
        ))
      }
    </div>
  )),
}))

test('should render correct layout for paragraphs', () => {
  render(
    <ParagraphLayoutComponent
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT}
      total={1}
    />,
  )

  const paragraph1 = screen.getByTestId(mockParagraph1.id)
  const paragraph2 = screen.getByTestId(mockParagraph2.id)

  expect(paragraph1).toBeInTheDocument()
  expect(screen.getByText(mockLine1.content)).toBeInTheDocument()
  expect(paragraph2).toBeInTheDocument()
  expect(screen.getByText(mockLine2.content)).toBeInTheDocument()
})
