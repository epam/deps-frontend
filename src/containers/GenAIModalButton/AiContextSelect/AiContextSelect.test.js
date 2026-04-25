
import { mockEnv } from '@/mocks/mockEnv'
import { screen, within, waitFor } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { render } from '@/utils/rendererRTL'
import {
  AiContext,
  AI_CONTEXT_TO_LABEL_MAPPER,
} from './AiContext'
import { AiContextSelect } from './AiContextSelect'

jest.mock('@/utils/env', () => mockEnv)

let defaultProps

beforeEach(() => {
  jest.clearAllMocks()
  defaultProps = {
    onChange: jest.fn(),
    value: AiContext.TEXT_ONLY,
  }
})

test('renders select component', () => {
  render(<AiContextSelect {...defaultProps} />)

  const select = screen.getByTestId('CustomSelect')
  expect(select).toBeInTheDocument()

  const selectedLabel = AI_CONTEXT_TO_LABEL_MAPPER[AiContext.TEXT_ONLY]
  expect(within(select).getByText(selectedLabel)).toBeInTheDocument()
})

test('calls onChange when option is selected', async () => {
  render(<AiContextSelect {...defaultProps} />)

  const select = screen.getByRole('combobox')
  await userEvent.click(select)

  const optionLabel = AI_CONTEXT_TO_LABEL_MAPPER[AiContext.TEXT_AND_IMAGES]
  const option = screen.getByText(optionLabel)

  await userEvent.click(option, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  await waitFor(() => {
    expect(defaultProps.onChange).toHaveBeenCalledWith(
      AiContext.TEXT_AND_IMAGES,
      expect.objectContaining({
        value: AiContext.TEXT_AND_IMAGES,
      }),
    )
  })
})
