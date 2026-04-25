
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { fireEvent, screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { TemperatureSection } from './TemperatureSection'

jest.mock('react-hook-form', () => mockReactHookForm)
jest.mock('@/utils/env', () => mockEnv)

const TEMPERATURE_VALUE = 0
const TEMPERATURE_VALUE_PRECISION = 1
const TOP_P_VALUE = 1
const TOP_P_VALUE_PRECISION = 2

test('renders Temperature field', () => {
  render(
    <TemperatureSection />,
  )

  const [slider] = screen.getAllByRole('slider')
  fireEvent.mouseDown(slider)

  const tooltip = screen.getByRole('tooltip')
  const [input] = screen.getAllByRole('spinbutton')

  expect(screen.getByText(localize(Localization.TEMPERATURE))).toBeInTheDocument()
  expect(tooltip).toHaveTextContent(TEMPERATURE_VALUE)
  expect(input).toHaveValue(TEMPERATURE_VALUE.toFixed(TEMPERATURE_VALUE_PRECISION))
})

test('renders TOP_P field', () => {
  render(
    <TemperatureSection />,
  )

  const [, slider] = screen.getAllByRole('slider')
  fireEvent.mouseDown(slider)

  const tooltip = screen.getByRole('tooltip')
  const [, input] = screen.getAllByRole('spinbutton')

  expect(screen.getByText(localize(Localization.TOP_P))).toBeInTheDocument()
  expect(tooltip).toHaveTextContent(TOP_P_VALUE)
  expect(input).toHaveValue(TOP_P_VALUE.toFixed(TOP_P_VALUE_PRECISION))
})
