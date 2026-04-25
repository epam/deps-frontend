
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { DOCUMENT_LAYOUT_PARSING_TYPE } from '@/enums/DocumentLayoutType'
import { ImageLayout as ImageLayoutModel } from '@/models/DocumentLayout'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { ImageLayout } from './ImageLayout'

jest.mock('@/utils/env', () => mockEnv)

const mockHighlightCoords = jest.fn()
const mockUnhighlightCoords = jest.fn()

jest.mock('@/containers/ParsingLayout/EntityLayout/hooks', () => ({
  useHighlightCoords: jest.fn(() => ({
    highlightCoords: mockHighlightCoords,
    unhighlightCoords: mockUnhighlightCoords,
  })),
}))

const mockImage1 = new ImageLayoutModel({
  id: 'img1',
  order: 1,
  title: 'Image 1',
  description: 'Description 1',
  filePath: 'mockPath1',
  polygon: [
    new Point(0.111, 0.222),
    new Point(0.333, 0.444),
  ],
})

const mockImage2 = new ImageLayoutModel({
  id: 'img2',
  order: 2,
  title: 'Image 2',
  description: 'Description 2',
  filePath: 'mockPath2',
  polygon: [
    new Point(0.555, 0.666),
    new Point(0.777, 0.888),
  ],
})

const mockData = [
  {
    layout: mockImage1,
    page: 1,
    pageId: 'page-1',
  },
  {
    layout: mockImage2,
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

jest.mock('./ImageField', () => ({
  ImageField: jest.fn(({ imageLayout, onClick }) => (
    <div
      data-testid={imageLayout.id}
      onClick={onClick}
    >
      <span>{imageLayout.title}</span>
      <span>{imageLayout.description}</span>
    </div>
  )),
}))

beforeEach(() => {
  jest.clearAllMocks()
})

test('should highlight coords on image click', async () => {
  render(
    <ImageLayout
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.AWS_TEXTRACT}
      total={1}
    />,
  )

  await userEvent.click(screen.getByTestId('img1'))

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockImage1.polygon],
    page: 1,
  })
})

test('should call unhighlightCoords when toggling off image', async () => {
  render(
    <ImageLayout
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.AWS_TEXTRACT}
      total={1}
    />,
  )

  await userEvent.click(screen.getByTestId('img1'))

  await userEvent.click(screen.getByTestId('img1'))

  expect(mockUnhighlightCoords).toHaveBeenCalled()
})

test('should render correct layout for images', () => {
  render(
    <ImageLayout
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.AWS_TEXTRACT}
      total={1}
    />,
  )

  const image1 = screen.getByTestId(mockImage1.id)
  const image2 = screen.getByTestId(mockImage2.id)

  expect(image1).toBeInTheDocument()
  expect(screen.getByText(mockImage1.title)).toBeInTheDocument()
  expect(screen.getByText(mockImage1.description)).toBeInTheDocument()
  expect(image2).toBeInTheDocument()
  expect(screen.getByText(mockImage2.title)).toBeInTheDocument()
  expect(screen.getByText(mockImage2.description)).toBeInTheDocument()
})

test('should highlight new image when clicking on different image', async () => {
  render(
    <ImageLayout
      parsingType={DOCUMENT_LAYOUT_PARSING_TYPE.AWS_TEXTRACT}
      total={1}
    />,
  )

  await userEvent.click(screen.getByTestId('img1'))

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockImage1.polygon],
    page: 1,
  })

  jest.clearAllMocks()

  await userEvent.click(screen.getByTestId('img2'))

  expect(mockHighlightCoords).toHaveBeenCalledWith({
    field: [mockImage2.polygon],
    page: 2,
  })
})
