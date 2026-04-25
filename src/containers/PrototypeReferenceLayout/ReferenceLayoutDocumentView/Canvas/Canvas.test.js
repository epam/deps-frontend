
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { waitFor } from '@testing-library/react'
import { Cursor } from '@/enums/Cursor'
import { useImageLoader } from '@/hooks/useImageLoader'
import { Point } from '@/models/Point'
import { render } from '@/utils/rendererRTL'
import { Canvas } from './Canvas'
import { CanvasLine } from './CanvasLine'
import { CanvasScaleConfig } from './CanvasScaleConfig'

const mockScaleConfig = new CanvasScaleConfig({
  min: 1,
  max: 5,
  step: 0.1,
  onChange: jest.fn(),
  value: 1,
})

const mockLine = new CanvasLine({
  coords: [
    new Point(0, 1),
    new Point(0, 2),
  ],
})

const mockImageUrl = 'http://sample.png'
const mockImageWidth = 100
const mockImageHeight = 100
const mockImage = new Image(mockImageWidth, mockImageHeight)

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/hooks/useImageLoader', () => ({
  useImageLoader: jest.fn(() => ({
    image: mockImage,
    isLoading: false,
  })),
}))

jest.mock('react-konva/lib/ReactKonvaCore', () => {
  const { forwardRef } = require('react')
  return {
    Stage: forwardRef((props, ref) => (
      <div
        role="img"
        {...props}
        ref={ref}
      />
    )),
    Layer: () => <div />,
    Group: () => <div />,
    Image: () => <div />,
    Line: () => <div />,
  }
})

test('show canvas with grab cursor by default', async () => {
  render(
    <Canvas
      imageUrl={mockImageUrl}
      lines={[mockLine]}
      onStageClick={jest.fn()}
      scaleConfig={mockScaleConfig}
    />,
  )

  const canvas = screen.getByRole('img')

  await waitFor(() => {
    expect(canvas).toBeInTheDocument()
  })

  await waitFor(() => {
    expect(canvas).toHaveStyle(`cursor: ${Cursor.GRAB}`)
  })
})

test('show spinner when image is loading', async () => {
  useImageLoader.mockImplementationOnce(() => ({
    image: mockImage,
    isLoading: true,
  }))

  render(
    <Canvas
      imageUrl={mockImageUrl}
      lines={[mockLine]}
      onStageClick={jest.fn()}
      scaleConfig={mockScaleConfig}
    />,
  )

  await waitFor(() => {
    expect(screen.getByTestId('spin')).toBeInTheDocument()
  })
})
