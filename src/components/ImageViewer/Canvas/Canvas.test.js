
import { mockEnv } from '@/mocks/mockEnv'
import {
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react'
import { Cursor } from '@/enums/Cursor'
import { Point } from '@/models/Point'
import { loadImageURL } from '@/utils/image'
import { render } from '@/utils/rendererRTL'
import { Canvas } from './Canvas'

const mockImageUrl = 'http://sample.png'
const mockImageWidth = 100
const mockImageHeight = 100
const mockImage = new Image(mockImageWidth, mockImageHeight)
mockImage.src = mockImageUrl
mockImage.resource = mockImageUrl

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/utils/image', () => ({
  loadImageURL: jest.fn(() => Promise.resolve(mockImage)),
}))

Object.defineProperty(window, 'DOMPoint', {
  writable: true,
  value: jest.fn().mockImplementation((x, y, z, w) => {
    return {
      x: x ?? 0,
      y: y ?? 0,
      z: z ?? 0,
      w: w ?? 0,
    }
  }),
})

test('render Canvas correctly', async () => {
  render(
    <Canvas
      cursor={Cursor.CROSSHAIR}
      imageUrl={mockImageUrl}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId('spin')).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})

test('show the spinner if image loading is in progress', async () => {
  loadImageURL.mockReturnValueOnce(new Promise(() => {}))

  render(<Canvas imageUrl={mockImageUrl} />)

  await waitFor(() => {
    expect(screen.getAllByTestId('spin')[1]).toHaveClass('ant-spin-spinning')
  })
})

test('draw image in the canvas after loading the image ', async () => {
  render(<Canvas imageUrl={mockImageUrl} />)

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')
  const mockCoords = {
    x: 0,
    y: 0,
  }

  expect(context.drawImage).nthCalledWith(
    1,
    mockImage,
    mockCoords.x,
    mockCoords.y,
  )
})

test('scale the image while painting the image', async () => {
  jest.clearAllMocks()

  const mockScaleFactor = 2
  const mockCanvasWidth = 200
  const mockCanvasHeight = 200
  const scaleConfig = {
    max: 6,
    min: 0.5,
    step: 0.1,
    onChange: jest.fn(),
    value: mockScaleFactor,
  }

  render(
    <Canvas
      height={mockCanvasHeight}
      imageUrl={mockImageUrl}
      scaleConfig={scaleConfig}
      width={mockCanvasWidth}
    />,
  )

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')

  expect(context.scale).nthCalledWith(2, mockScaleFactor, mockScaleFactor)
  expect(context.scale).nthCalledWith(2, mockCanvasWidth / mockImageWidth, mockCanvasHeight / mockImageWidth)
})

test('rotate the image to the passed angle while painting the image', async () => {
  jest.clearAllMocks()

  const mockRotateDegrees = 180
  const mockRotateToRadians = mockRotateDegrees * (Math.PI / 180)

  render(
    <Canvas
      imageUrl={mockImageUrl}
      rotationAngle={mockRotateDegrees}
    />,
  )

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')

  expect(context.rotate).nthCalledWith(1, mockRotateToRadians)
})

test('clear the canvas before drawing', async () => {
  jest.clearAllMocks()

  const mockCanvasWidth = 200
  const mockCanvasHeight = 200

  render(
    <Canvas
      height={mockCanvasHeight}
      imageUrl={mockImageUrl}
      width={mockCanvasWidth}
    />,
  )

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')

  expect(context.clearRect).nthCalledWith(1, 0, 0, mockCanvasWidth, mockCanvasHeight)
})

test('translate the image to the correct position while dragging', async () => {
  const mockCanvasWidth = 120
  const mockCanvasHeight = 150

  render(
    <Canvas
      height={mockCanvasHeight}
      imageUrl={mockImageUrl}
      width={mockCanvasWidth}
    />,
  )

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')
  context.getTransform.mockImplementation(() => ({
    invertSelf: jest.fn(() => ({
      transformPoint: jest.fn(() => (new Point(0, 0))),
    })),
  }))

  const mockDragEvent = {
    clientX: -10,
    clientY: 0,
  }

  fireEvent.mouseDown(canvas)

  jest.clearAllMocks()

  fireEvent.mouseMove(canvas, mockDragEvent)

  expect(context.translate).nthCalledWith(1, mockDragEvent.clientX, mockDragEvent.clientY)
  expect(canvas).toHaveStyle('cursor: grabbing')
})

test('draw polygons if they passed as props', async () => {
  const mockPolygons = [[
    new Point(0, 0),
    new Point(0.1, 0),
    new Point(0.2, 0.21),
    new Point(0.3, 0.45),
    new Point(0.1, 0.2),
  ]]

  render(
    <Canvas
      imageUrl={mockImageUrl}
      polygons={mockPolygons}
    />)

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')

  expect(context.beginPath).toHaveBeenCalledTimes(1)
  expect(context.moveTo).toHaveBeenCalledWith(0, 0)
  expect(context.lineTo).toHaveBeenCalledWith(10, 0)
  expect(context.lineTo).toHaveBeenCalledWith(20, 21)
  expect(context.lineTo).toHaveBeenCalledWith(30, 45)
  expect(context.lineTo).toHaveBeenCalledWith(10, 20)
  expect(context.closePath).toHaveBeenCalledTimes(1)
  expect(context.stroke).toHaveBeenCalledTimes(1)
})

test('translate the image to the correct position while dragging with boundaries', async () => {
  const mockCanvasWidth = 120
  const mockCanvasHeight = 150

  render(
    <Canvas
      height={mockCanvasHeight}
      imageUrl={mockImageUrl}
      width={mockCanvasWidth}
    />,
  )

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')
  context.getTransform.mockImplementation(() => ({
    invertSelf: jest.fn(() => ({
      transformPoint: jest.fn(() => (new Point(0, 0))),
    })),
  }))

  const mockDragEvent = {
    clientX: -1000,
    clientY: 0,
  }

  fireEvent.mouseDown(canvas)

  jest.clearAllMocks()

  fireEvent.mouseMove(canvas, mockDragEvent)

  expect(context.translate).nthCalledWith(1, -30, mockDragEvent.clientY)
  expect(canvas).toHaveStyle('cursor: grabbing')
})

test('translate the image that is larger than canvas to the correct position while dragging with boundaries', async () => {
  const mockCanvasWidth = 100
  const mockCanvasHeight = 120

  render(
    <Canvas
      height={mockCanvasHeight}
      imageUrl={mockImageUrl}
      width={mockCanvasWidth}
    />,
  )

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')
  context.getTransform.mockImplementation(() => ({
    invertSelf: jest.fn(() => ({
      transformPoint: jest.fn(() => (new Point(0, 0))),
    })),
  }))

  const mockDragEvent = {
    clientX: -30,
    clientY: 0,
  }

  fireEvent.mouseDown(canvas)

  jest.clearAllMocks()

  fireEvent.mouseMove(canvas, mockDragEvent)

  expect(context.translate).nthCalledWith(1, -20, mockDragEvent.clientY)
})

test('fill polygon if activePolygons contains the polygon', async () => {
  const mockPolygons = [[
    new Point(0, 0),
    new Point(0.1, 0),
    new Point(0.2, 0.21),
    new Point(0.3, 0.45),
    new Point(0.1, 0.2),
  ]]

  render(
    <Canvas
      activePolygons={mockPolygons}
      imageUrl={mockImageUrl}
      polygons={mockPolygons}
    />,
  )

  const canvas = await screen.findByRole('img')
  const context = canvas.getContext('2d')

  expect(context.fill).toHaveBeenCalled()
})
