
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLayoutMutation } from '@/containers/ParsingLayout/EntityLayout/hooks'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { LineLayout } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { LineLayout as LineComponent } from './LineLayout'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useLayoutMutation: jest.fn(() => ({
    isEditable: true,
    updateParagraph: mockUpdateParagraph,
  })),
  useHighlightCoords: jest.fn(() => ({ highlightCoords: mockHighlightCoords })),
}))

const TEST_ID = {
  LINE_INPUT: 'line-input',
  LINE_WRAPPER: 'line-wrapper',
}

const mockLine = new LineLayout({
  order: 1,
  confidence: 0,
  content: 'content',
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockUpdateParagraph = jest.fn().mockResolvedValue({})
const mockHighlightCoords = jest.fn()

const defaultProps = {
  page: 1,
  pageId: 'mockPageId',
  line: mockLine,
  paragraphId: 'paragraph-1',
  parsingType: DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders input when isEditable is true', () => {
  render(<LineComponent {...defaultProps} />)

  const input = screen.getByTestId(TEST_ID.LINE_INPUT)
  expect(input).toBeInTheDocument()
  expect(input).toHaveValue('content')
})

test('renders wrapper when isEditable is false', () => {
  useLayoutMutation.mockReturnValueOnce({
    isEditable: false,
    updateParagraph: mockUpdateParagraph,
  })

  render(<LineComponent {...defaultProps} />)

  const wrapper = screen.getByTestId(TEST_ID.LINE_WRAPPER)
  expect(wrapper).toBeInTheDocument()
  expect(wrapper).toHaveTextContent('content')
  expect(screen.queryByTestId(TEST_ID.LINE_INPUT)).not.toBeInTheDocument()
})

test('calls highlightCoords with correct arguments when input is clicked', async () => {
  render(<LineComponent {...defaultProps} />)

  const input = screen.getByTestId(TEST_ID.LINE_INPUT)
  await userEvent.click(input)

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockLine.polygon],
    page: defaultProps.page,
  })
})

test('calls highlightCoords with correct arguments when wrapper is clicked', async () => {
  useLayoutMutation.mockReturnValueOnce({
    isEditable: false,
    updateParagraph: mockUpdateParagraph,
  })

  render(<LineComponent {...defaultProps} />)

  const wrapper = screen.getByTestId(TEST_ID.LINE_WRAPPER)
  await userEvent.click(wrapper)

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockLine.polygon],
    page: defaultProps.page,
  })
})

test('does not call highlightCoords if line.polygon is empty when input is clicked', async () => {
  const lineWithoutPolygon = new LineLayout({
    ...mockLine,
    polygon: [],
  })

  render(
    <LineComponent
      {...defaultProps}
      line={lineWithoutPolygon}
    />,
  )

  const input = screen.getByTestId(TEST_ID.LINE_INPUT)
  await userEvent.click(input)

  expect(mockHighlightCoords).not.toHaveBeenCalled()
})

test('does not call highlightCoords if line.polygon is empty when wrapper is clicked', async () => {
  useLayoutMutation.mockReturnValueOnce({
    isEditable: false,
    updateParagraph: mockUpdateParagraph,
  })

  const lineWithoutPolygon = new LineLayout({
    ...mockLine,
    polygon: [],
  })

  render(
    <LineComponent
      {...defaultProps}
      line={lineWithoutPolygon}
    />,
  )

  const wrapper = screen.getByTestId(TEST_ID.LINE_WRAPPER)
  await userEvent.click(wrapper)

  expect(mockHighlightCoords).not.toHaveBeenCalled()
})

test('calls updateParagraph with correct data when content is changed and input is blurred', async () => {
  render(<LineComponent {...defaultProps} />)

  const input = screen.getByTestId(TEST_ID.LINE_INPUT)
  await userEvent.click(input)
  await userEvent.clear(input)
  await userEvent.type(input, 'new content')
  await userEvent.tab()

  await waitFor(() => {
    expect(mockUpdateParagraph).toHaveBeenCalledWith({
      pageId: defaultProps.pageId,
      paragraphId: defaultProps.paragraphId,
      body: {
        lines: [
          expect.objectContaining({
            order: mockLine.order,
            content: 'new content',
          }),
        ],
      },
    })
  })
})

test('does not call updateParagraph when content is unchanged and input is blurred', async () => {
  render(<LineComponent {...defaultProps} />)

  const input = screen.getByTestId(TEST_ID.LINE_INPUT)
  await userEvent.click(input)
  await userEvent.tab()

  expect(mockUpdateParagraph).not.toHaveBeenCalled()
})

test('updates input value when user types', async () => {
  render(<LineComponent {...defaultProps} />)

  const input = screen.getByTestId(TEST_ID.LINE_INPUT)
  await userEvent.clear(input)
  await userEvent.type(input, 'updated text')

  expect(input).toHaveValue('updated text')
})

test('updates input value when line.content prop changes', () => {
  const { rerender } = render(<LineComponent {...defaultProps} />)

  expect(screen.getByTestId(TEST_ID.LINE_INPUT)).toHaveValue('content')

  const newLine = new LineLayout({
    ...mockLine,
    content: 'new value',
  })

  rerender(
    <LineComponent
      {...defaultProps}
      line={newLine}
    />,
  )

  expect(screen.getByTestId(TEST_ID.LINE_INPUT)).toHaveValue('new value')
})

test('renders input when parsingType is USER_DEFINED and isEditable is true', () => {
  render(
    <LineComponent
      {...defaultProps}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.USER_DEFINED}
    />,
  )

  expect(screen.getByTestId(TEST_ID.LINE_INPUT)).toBeInTheDocument()
})

test('renders wrapper when parsingType is not USER_DEFINED', () => {
  useLayoutMutation.mockReturnValueOnce({
    isEditable: false,
    updateParagraph: mockUpdateParagraph,
  })

  render(
    <LineComponent
      {...defaultProps}
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.TESSERACT}
    />,
  )

  expect(screen.getByTestId(TEST_ID.LINE_WRAPPER)).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.LINE_INPUT)).not.toBeInTheDocument()
})

test('switches from input to wrapper when isEditable changes from true to false', () => {
  const { rerender } = render(<LineComponent {...defaultProps} />)

  expect(screen.getByTestId(TEST_ID.LINE_INPUT)).toBeInTheDocument()

  useLayoutMutation.mockReturnValueOnce({
    isEditable: false,
    updateParagraph: mockUpdateParagraph,
  })

  rerender(<LineComponent {...defaultProps} />)

  expect(screen.getByTestId(TEST_ID.LINE_WRAPPER)).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.LINE_INPUT)).not.toBeInTheDocument()
})

test('calls highlightCoords with correct page when page prop changes', async () => {
  const props = {
    ...defaultProps,
    page: 2,
  }

  render(<LineComponent {...props} />)

  const input = screen.getByTestId(TEST_ID.LINE_INPUT)
  await userEvent.click(input)

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockLine.polygon],
    page: 2,
  })
})
