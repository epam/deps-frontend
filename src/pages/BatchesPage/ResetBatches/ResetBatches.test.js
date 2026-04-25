
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useDispatch } from 'react-redux'
import { setFilters, setPagination } from '@/actions/navigation'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { ResetBatches } from './ResetBatches'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

jest.mock('@/actions/navigation', () => ({
  setPagination: jest.fn(),
  setFilters: jest.fn(),
}))

jest.mock('@/components/Icons/ResetFiltrationIcon', () => ({
  ResetFiltrationIcon: () => mockIconContent,
}))

const mockIconContent = 'Reset Filtration'

describe('ResetBatches Component', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    jest.clearAllMocks()
  })

  test('shows correct tooltip message when user hovers the trigger button', async () => {
    render(<ResetBatches />)

    const resetButton = screen.getByRole('button', {
      name: mockIconContent,
    })

    await userEvent.hover(resetButton)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveTextContent(localize(Localization.RESET_FILTERS))
    })
  })

  test('dispatches setPagination and setFilters on click', async () => {
    render(<ResetBatches />)

    const button = screen.getByRole('button', {
      name: mockIconContent,
    })

    await userEvent.click(button)

    expect(mockDispatch).toHaveBeenCalledWith(setPagination({
      page: 1,
      perPage: 10,
    }))
    expect(mockDispatch).toHaveBeenCalledWith(setFilters(null))
  })
})
