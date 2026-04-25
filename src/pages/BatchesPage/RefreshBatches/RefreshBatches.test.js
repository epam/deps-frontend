
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { localize, Localization } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { RefreshBatches } from './RefreshBatches'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/ArrowsRotate', () => ({
  ArrowsRotate: () => mockIconContent,
}))

const mockIconContent = 'Rotate'

describe('RefreshBatches Component', () => {
  const mockRefetch = jest.fn()

  const props = {
    refetch: mockRefetch,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows correct tooltip message when user hovers the trigger button', async () => {
    render(<RefreshBatches {...props} />)

    const refreshButton = screen.getByRole('button', { name: mockIconContent })

    await userEvent.hover(refreshButton)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveTextContent(localize(Localization.REFRESH_DATA))
    })
  })

  test('calls refetch function when button is clicked', async () => {
    render(<RefreshBatches {...props} />)

    const refreshButton = screen.getByRole('button', { name: mockIconContent })

    await userEvent.click(refreshButton)

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })
})
