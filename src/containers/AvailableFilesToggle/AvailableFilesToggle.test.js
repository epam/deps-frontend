
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setFilters } from '@/actions/navigation'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { AvailableFilesToggle } from './AvailableFilesToggle'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/actions/navigation', () => ({
  setFilters: jest.fn(),
}))

const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

const defaultFilterConfig = {
  page: 1,
  perPage: 20,
  referenceAvailable: false,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders toggle label correctly', () => {
  render(<AvailableFilesToggle filterConfig={defaultFilterConfig} />)

  const label = screen.getByText(localize(Localization.ONLY_AVAILABLE_FILES))
  expect(label).toBeInTheDocument()
})

test('renders switch with checked state when referenceAvailable is true', () => {
  const filterConfig = {
    ...defaultFilterConfig,
    referenceAvailable: true,
  }

  render(<AvailableFilesToggle filterConfig={filterConfig} />)

  const switchElement = screen.getByRole('switch')

  expect(switchElement).toBeChecked()
})

test('dispatches setFilters with true when switch is clicked from unchecked state', async () => {
  render(<AvailableFilesToggle filterConfig={defaultFilterConfig} />)

  const switchElement = screen.getByRole('switch')

  await userEvent.click(switchElement)

  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(setFilters).toHaveBeenCalledWith({
    ...defaultFilterConfig,
    referenceAvailable: true,
  })
})

test('dispatches setFilters when label is clicked', async () => {
  render(<AvailableFilesToggle filterConfig={defaultFilterConfig} />)

  const label = screen.getByText(localize(Localization.ONLY_AVAILABLE_FILES))

  await userEvent.click(label)

  expect(mockDispatch).toHaveBeenCalledTimes(1)
  expect(setFilters).toHaveBeenCalledWith({
    ...defaultFilterConfig,
    referenceAvailable: true,
  })
})

test('toggles between true and false correctly', async () => {
  const { rerender } = render(
    <AvailableFilesToggle filterConfig={defaultFilterConfig} />,
  )

  const switchElement = screen.getByRole('switch')

  await userEvent.click(switchElement)
  expect(setFilters).toHaveBeenNthCalledWith(1, {
    ...defaultFilterConfig,
    referenceAvailable: true,
  })

  const filterConfigTrue = {
    ...defaultFilterConfig,
    referenceAvailable: true,
  }

  rerender(<AvailableFilesToggle filterConfig={filterConfigTrue} />)

  await userEvent.click(switchElement)
  expect(setFilters).toHaveBeenNthCalledWith(2, {
    ...defaultFilterConfig,
    referenceAvailable: false,
  })

  expect(mockDispatch).toHaveBeenCalledTimes(2)
})
