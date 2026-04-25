
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { useChatSettings } from '../hooks'
import { PageSettingsButton } from './PageSettingsButton'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('../SettingsButton', () => {
  const { forwardRef } = require('react')

  return {
    SettingsButton: forwardRef(({ disabled, onClick, title }, ref) => (
      <button
        ref={ref}
        data-testid='settings-button'
        disabled={disabled}
        onClick={onClick}
      >
        {title}
      </button>
    )),
  }
})

jest.mock('@/containers/PageSettingsModal', () => ({
  PageSettingsModal: ({ renderTrigger }) => (
    <>
      {renderTrigger(mockOnClick)}
      <div data-testid='page-settings-modal' />
    </>
  ),
}))

jest.mock('../hooks', () => ({
  useChatSettings: jest.fn(() => ({
    pageSpan: mockPageSpan,
    setPageSpan: mockSetPageSpan,
  })),
}))

const mockSetPageSpan = jest.fn()

const mockPageSpan = ['1', '3']
const mockOnClick = jest.fn()

test('renders correct layout', () => {
  render(<PageSettingsButton disabled={false} />)

  expect(screen.getByTestId('settings-button')).toHaveTextContent(
    localize(Localization.PAGES_RANGE, { range: `${mockPageSpan[0]} - ${mockPageSpan[1]}` }),
  )
  expect(screen.getByTestId('page-settings-modal')).toBeInTheDocument()
})

test('renders button with "All Pages" title when page span is empty', () => {
  useChatSettings.mockImplementationOnce(() => ({
    pageSpan: [],
    setPageSpan: mockSetPageSpan,
  }))

  render(<PageSettingsButton disabled={false} />)

  expect(screen.getByTestId('settings-button')).toHaveTextContent(localize(Localization.ALL_PAGES))
})

test('disables button when disable prop is true', () => {
  render(<PageSettingsButton disabled={true} />)

  expect(screen.getByTestId('settings-button')).toBeDisabled()
})
