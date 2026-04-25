
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { useFieldCalibration } from '@/containers/PromptCalibrationStudio/hooks'
import {
  Field,
  Query,
  MULTIPLICITY,
} from '@/containers/PromptCalibrationStudio/viewModels'
import { FieldType } from '@/enums/FieldType'
import { render } from '@/utils/rendererRTL'
import { FieldsSwitcher } from './FieldsSwitcher'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PromptCalibrationStudio/hooks', () => ({
  useFieldCalibration: jest.fn(() => mockCalibrationState),
}))

const mockField1 = new Field({
  id: 'field-1',
  name: 'Test Field',
  value: 'initial value',
  extractorId: 'extractor-1',
  query: new Query({
    nodes: null,
    value: 'initial value',
  }),
  fieldType: FieldType.STRING,
  multiplicity: MULTIPLICITY.SINGLE,
})

const mockField2 = new Field({
  id: 'field-2',
  name: 'Test Field 2',
  value: 'value 2',
  query: new Query({
    nodes: null,
    value: 'value 2',
  }),
  extractorId: 'extractor-1',
  fieldType: FieldType.STRING,
  multiplicity: MULTIPLICITY.SINGLE,
})

const mockSetActiveField = jest.fn()

const mockCalibrationState = {
  activeField: mockField1,
  fields: [mockField1, mockField2],
  setActiveField: mockSetActiveField,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders FieldsSwitcher with both navigation buttons', () => {
  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')

  expect(buttons.length).toBe(2)
})

test('does not disable previous button when currentIndex is 0', () => {
  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')
  const previousButton = buttons[0]

  expect(previousButton).not.toBeDisabled()
})

test('enables previous button when currentIndex is greater than 0', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: mockField2,
  })

  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')
  const previousButton = buttons[0]

  expect(previousButton).not.toBeDisabled()
})

test('does not disable next button when currentIndex equals maxIndex', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: mockField2,
  })

  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')
  const nextButton = buttons[1]

  expect(nextButton).not.toBeDisabled()
})

test('enables next button when currentIndex is less than maxIndex', () => {
  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')
  const nextButton = buttons[1]

  expect(nextButton).not.toBeDisabled()
})

test('disables both buttons when active field is mutated', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: {
      ...mockField1,
      value: 'value 2',
    },
  })

  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')

  expect(buttons[0]).toBeDisabled()
  expect(buttons[1]).toBeDisabled()
})

test('disables both buttons when fields length is 1', () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    fields: [mockField1],
  })

  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')

  expect(buttons[0]).toBeDisabled()
  expect(buttons[1]).toBeDisabled()
})

test('calls setActiveField with previous field when previous button is clicked', async () => {
  useFieldCalibration.mockReturnValueOnce({
    ...mockCalibrationState,
    activeField: mockField2,
  })

  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')
  const previousButton = buttons[0]

  await userEvent.click(previousButton, { pointerEventsCheck: PointerEventsCheckLevel.Never })

  expect(mockSetActiveField).toHaveBeenCalledWith(mockField1)
})

test('calls setActiveField with next field when next button is clicked', async () => {
  render(<FieldsSwitcher />)

  const buttons = screen.getAllByRole('button')
  const nextButton = buttons[1]

  await userEvent.click(nextButton, { pointerEventsCheck: PointerEventsCheckLevel.Never })

  expect(mockSetActiveField).toHaveBeenCalledWith(mockField2)
})
