
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/react'
import { render } from '@/utils/rendererRTL'
import { GraduatedSlider } from './GraduatedSlider'

jest.mock('@/utils/env', () => mockEnv)

test('renders slider with passed parameters', () => {
  const mockValue = 0.75
  const minValue = 0
  const maxValue = 1
  const mockStep = 0.05

  render(
    <GraduatedSlider
      max={maxValue}
      min={minValue}
      onChange={jest.fn()}
      step={mockStep}
      value={mockValue}
    />,
  )

  const slider = screen.getByRole('slider')
  expect(slider).toBeInTheDocument()

  fireEvent.mouseDown(slider)

  const tooltip = screen.getByRole('tooltip')
  expect(tooltip).toHaveTextContent(mockValue)
})

test('renders number input with passed parameters', () => {
  const mockValue = 0.75
  const minValue = 0
  const maxValue = 1
  const mockPrecision = 2
  const mockValueWithPrecision = mockValue.toFixed(mockPrecision)

  render(
    <GraduatedSlider
      max={maxValue}
      min={minValue}
      onChange={jest.fn()}
      precision={mockPrecision}
      value={mockValue}
    />,
  )

  const input = screen.getByRole('spinbutton')

  expect(input).toBeInTheDocument()
  expect(input).toHaveValue(mockValueWithPrecision)
})
