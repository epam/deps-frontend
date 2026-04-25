
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { goTo } from '@/actions/navigation'
import { EXTRACTION_TYPE_FILTER_KEY } from '@/constants/navigation'
import { Localization, localize } from '@/localization/i18n'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { openInNewTarget } from '@/utils/window'
import { AIPromptedCard } from './AIPromptedCard'

jest.mock('@/utils/env', () => mockEnv)
const mockDispatch = jest.fn()

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

jest.mock('@/actions/navigation', () => ({
  goTo: jest.fn((pathname, config) => ({
    pathname,
    config,
  })),
}))

jest.mock('@/utils/window', () => ({
  openInNewTarget: jest.fn(),
}))

const defaultProps = {
  count: 10,
  isFetching: false,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('should render correct layout with AI-Prompted document types', () => {
  render(<AIPromptedCard {...defaultProps} />)

  expect(screen.getByText(localize(Localization.AI_PROMPTED))).toBeInTheDocument()
  expect(screen.getByText(defaultProps.count)).toBeInTheDocument()
})

test('should dispatch goTo action with correct filters when card is clicked', async () => {
  render(<AIPromptedCard {...defaultProps} />)

  const cardTitle = screen.getByText(localize(Localization.AI_PROMPTED))
  await userEvent.click(cardTitle)

  const openInNewTargetCall = openInNewTarget.mock.calls[0]
  const callback = openInNewTargetCall[2]

  callback()

  expect(mockDispatch).toHaveBeenCalled()
  expect(goTo).toHaveBeenCalledWith(
    navigationMap.documentTypes(),
    expect.objectContaining({
      filters: expect.objectContaining({
        extractionType: EXTRACTION_TYPE_FILTER_KEY.aiPrompted,
      }),
    }),
  )
})

test('shows loading spinner if prop isFetching is true', () => {
  render(
    <AIPromptedCard
      count={0}
      isFetching={true}
    />,
  )

  expect(screen.getAllByTestId('spin')[1]).toHaveClass('ant-spin-spinning')
})
