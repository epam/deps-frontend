
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactHookForm } from '@/mocks/mockReactHookForm'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { LLMExtractorPageSpan } from '@/models/LLMExtractor'
import { render } from '@/utils/rendererRTL'
import { PageSpanSection } from './PageSpanSection'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-hook-form', () => mockReactHookForm)

const PAGE_SPAN = 'pageSpan'

const defaultProps = {
  onChange: jest.fn(),
}

afterEach(() => {
  jest.clearAllMocks()
})

test('renders "All Pages" mode by default', () => {
  render(<PageSpanSection {...defaultProps} />)

  const pageRangeButton = screen.getByRole('radio', {
    name: localize(Localization.RANGE),
  })
  const allPagesButton = screen.getByRole('radio', {
    name: localize(Localization.ALL_PAGES),
  })

  expect(pageRangeButton).not.toBeChecked()
  expect(allPagesButton).toBeChecked()

  expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
  expect(screen.queryByText(localize(Localization.PAGES))).not.toBeInTheDocument()
})

test('renders start page and end page if initial page span is passed', async () => {
  const mockPageSpan = new LLMExtractorPageSpan({
    start: 2,
    end: 3,
  })

  const props = {
    ...defaultProps,
    value: mockPageSpan,
  }

  render(<PageSpanSection {...props} />, { initialState: { pageSpan: mockPageSpan } })

  const pageRangeButton = screen.getByRole('radio', {
    name: localize(Localization.RANGE),
  })

  const [start, end] = screen.getAllByRole('spinbutton')

  expect(pageRangeButton).toBeChecked()
  expect(start).toHaveValue(mockPageSpan.start.toString())
  expect(end).toHaveValue(mockPageSpan.end.toString())
})

test('switches to "Page Range" mode and shows input fields', async () => {
  const mockPageSpan = new LLMExtractorPageSpan({
    start: 1,
    end: 50,
  })

  render(<PageSpanSection {...defaultProps} />)

  const pageRangeButton = screen.getByRole('radio', {
    name: localize(Localization.RANGE),
  })

  await userEvent.click(pageRangeButton)

  expect(defaultProps.onChange).toHaveBeenCalledWith(mockPageSpan)
  expect(screen.getAllByRole('spinbutton')).toHaveLength(2)
  expect(screen.getByText(localize(Localization.PAGES))).toBeInTheDocument()
})

test('resets the field when switching back to "All Pages"', async () => {
  render(<PageSpanSection {...defaultProps} />)
  const user = userEvent.setup()

  const pageRangeButton = screen.getByRole('radio', {
    name: localize(Localization.RANGE),
  })
  const allPagesButton = screen.getByRole('radio', {
    name: localize(Localization.ALL_PAGES),
  })

  await user.click(pageRangeButton)
  await user.click(allPagesButton)

  expect(defaultProps.onChange).toHaveBeenCalledWith(null)
})

test('allows user to change start page and end page if form is valid', async () => {
  render(<PageSpanSection {...defaultProps} />)
  const user = userEvent.setup()

  const rangeButton = screen.getByRole('radio', {
    name: localize(Localization.RANGE),
  })
  await user.click(rangeButton)

  const [startInput, endInput] = screen.getAllByRole('spinbutton')

  await user.clear(startInput)
  await user.type(startInput, '1')
  await user.clear(endInput)
  await user.type(endInput, '2')

  expect(defaultProps.onChange).toHaveBeenCalledWith(
    new LLMExtractorPageSpan({
      start: 1,
      end: 2,
    }),
  )
})

test('does not update form with invalid page range', async () => {
  render(<PageSpanSection {...defaultProps} />)
  const user = userEvent.setup()

  const rangeButton = screen.getByRole('radio', {
    name: localize(Localization.RANGE),
  })
  await user.click(rangeButton)

  const [startInput, endInput] = screen.getAllByRole('spinbutton')

  await user.clear(startInput)
  await user.clear(endInput)
  await user.type(startInput, '5')
  await user.type(endInput, '2')

  expect(defaultProps.onChange).not.toHaveBeenCalledWith(
    PAGE_SPAN,
    new LLMExtractorPageSpan({
      start: 5,
      end: 2,
    }),
  )
})
