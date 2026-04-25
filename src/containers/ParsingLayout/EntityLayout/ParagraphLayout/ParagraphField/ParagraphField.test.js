
import { mockShallowComponent } from '@/mocks/mockComponent'
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import {
  LineLayout as LineLayoutModel,
  ParagraphLayout,
} from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { ParagraphField } from './ParagraphField'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/containers/InView', () => mockShallowComponent('InView'))
jest.mock('@/containers/ParsingLayout/EntityLayout/ParagraphLayout/LineLayout', () => mockShallowComponent('LineLayout'))

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useHighlightCoords: jest.fn(() => ({ highlightCoords: mockHighlightCoords })),
  useLayoutMutation: jest.fn(() => ({
    isEditable: true,
    updateParagraph: mockUpdateParagraph,
  })),
}))

const mockLine1 = new LineLayoutModel({
  order: 1,
  confidence: 0,
  content: 'Line 1 content',
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockLine2 = new LineLayoutModel({
  order: 2,
  confidence: 0,
  content: 'Line 2 content',
  polygon: [
    new Point(0.555, 0.666),
    new Point(0.777, 0.888),
  ],
})

const mockParagraph = new ParagraphLayout({
  id: 'mockId',
  order: 1,
  confidence: 0,
  content: 'content',
  role: 'role',
  polygon: [
    new Point(0.751, 0.812),
    new Point(0.523, 0.954),
  ],
  lines: [mockLine1],
})

const mockUpdateParagraph = jest.fn().mockResolvedValue({})
const mockHighlightCoords = jest.fn()

const defaultProps = {
  page: 1,
  paragraph: mockParagraph,
  pageId: 'mockPageId',
  parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders paragraph field with InView wrapper', () => {
  render(<ParagraphField {...defaultProps} />)

  const inView = screen.getByTestId('InView')
  expect(inView).toBeInTheDocument()
})

test('renders paragraph field with lines', () => {
  render(<ParagraphField {...defaultProps} />)

  const lineLayout = screen.getByTestId('LineLayout')
  expect(lineLayout).toBeInTheDocument()
})

test('renders all lines from paragraph', () => {
  const paragraphWithMultipleLines = new ParagraphLayout({
    ...mockParagraph,
    lines: [mockLine1, mockLine2],
  })

  render(
    <ParagraphField
      {...defaultProps}
      paragraph={paragraphWithMultipleLines}
    />,
  )

  const lineLayouts = screen.getAllByTestId('LineLayout')
  expect(lineLayouts).toHaveLength(2)
})

test('renders empty lines wrapper when paragraph has no lines', () => {
  const paragraphWithNoLines = new ParagraphLayout({
    ...mockParagraph,
    lines: [],
  })

  render(
    <ParagraphField
      {...defaultProps}
      paragraph={paragraphWithNoLines}
    />,
  )

  const lineLayouts = screen.queryAllByTestId('LineLayout')
  expect(lineLayouts).toHaveLength(0)
})

test('calls highlightCoords with correct arguments when icon button is clicked', async () => {
  render(<ParagraphField {...defaultProps} />)

  const iconButton = screen.getByRole('button', { hidden: true })

  await userEvent.click(iconButton)

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockParagraph.polygon],
    page: defaultProps.page,
  })
})

test('calls highlightCoords with correct arguments for different page', async () => {
  const props = {
    ...defaultProps,
    page: 2,
  }

  render(<ParagraphField {...props} />)

  const iconButton = screen.getByRole('button', { hidden: true })

  await userEvent.click(iconButton)

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockParagraph.polygon],
    page: 2,
  })
})

test('renders icon button', () => {
  render(<ParagraphField {...defaultProps} />)

  const iconButton = screen.getByRole('button', { hidden: true })

  expect(iconButton).toBeInTheDocument()
})
