
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'
import { fetchOCREngines } from '@/actions/engines'
import { KnownOCREngine, RESOURCE_OCR_ENGINE } from '@/enums/KnownOCREngine'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { LayoutEngine } from './LayoutEngine'

const mockAction = {
  fetchOCREngines: 'fetchOCREngines',
}

const mockDispatch = jest.fn((action) => action)

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => mockDispatch),
}))

jest.mock('@/actions/engines', () => ({
  fetchOCREngines: jest.fn(() => mockAction.fetchOCREngines),
}))

jest.mock('@/selectors/engines')
jest.mock('@/selectors/requests')
jest.mock('@/utils/env', () => mockEnv)

const mockEngine = KnownOCREngine.AWS_TEXTRACT
const mockEngineTitle = RESOURCE_OCR_ENGINE[mockEngine]

test('should call dispatch with fetchOCREngines action', () => {
  render(
    <LayoutEngine
      engine={mockEngine}
      updateProfile={jest.fn()}
    />,
  )

  expect(mockDispatch).nthCalledWith(1, fetchOCREngines())
})

test('shows correct engines selector', () => {
  render(
    <LayoutEngine
      engine={mockEngine}
      updateProfile={jest.fn()}
    />,
  )

  expect(screen.getByText(localize(Localization.ENGINE))).toBeInTheDocument()
  expect(screen.getByRole('combobox')).toBeInTheDocument()
  expect(screen.getByText(mockEngineTitle)).toBeInTheDocument()
})

test('calls updateProfile if user selected engine', async () => {
  const newEngineTitle = localize(Localization.GCP_DOCUMENT_AI)
  const mockUpdateProfile = jest.fn()

  render(
    <LayoutEngine
      engine={mockEngine}
      updateProfile={mockUpdateProfile}
    />,
  )

  const engineSelector = screen.getByTitle(mockEngineTitle)
  await userEvent.click(engineSelector)

  const option = screen.getByTitle(newEngineTitle)
  await userEvent.click(option, {
    pointerEventsCheck: PointerEventsCheckLevel.Never,
  })

  expect(mockUpdateProfile).nthCalledWith(
    1,
    expect.any(Function),
  )
})
