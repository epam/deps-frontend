
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { useChatSettings } from '../hooks'
import { ModalHeader } from './ModalHeader'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/components/Icons/CompressIcon', () => ({
  CompressIcon: () => <span data-testid='compress-icon' />,
}))
jest.mock('@/components/Icons/ExpandIcon', () => ({
  ExpandIcon: () => <span data-testid='expand-icon' />,
}))
jest.mock('@/components/Icons/ShortLogoIcon', () => ({
  ShortLogoIcon: () => <span data-testid='short-logo-icon' />,
}))
jest.mock('@/components/Icons/XMarkIcon', () => ({
  XMarkIcon: () => <span data-testid='xmark-icon' />,
}))

jest.mock('../hooks', () => ({
  useChatSettings: jest.fn(() => ({
    isExpandedView: true,
    closeModal: mockCloseModal,
    toggleExpanded: mockToggleExpanded,
  })),
}))

const mockCloseModal = jest.fn()
const mockToggleExpanded = jest.fn()

test('renders header with correct layout in base view', () => {
  useChatSettings.mockImplementationOnce(() => ({
    isExpandedView: false,
    closeModal: mockCloseModal,
    toggleExpanded: mockToggleExpanded,
  }))

  render(<ModalHeader />)

  expect(screen.getByText(localize(Localization.DEPS_AGENT))).toBeInTheDocument()
  expect(screen.getByTestId('short-logo-icon')).toBeInTheDocument()
  expect(screen.getByTestId('expand-icon')).toBeInTheDocument()
  expect(screen.getByTestId('xmark-icon')).toBeInTheDocument()
})

test('renders header with correct layout in expanded view', () => {
  render(<ModalHeader />)

  expect(screen.getByText(localize(Localization.DEPS_AGENT))).toBeInTheDocument()
  expect(screen.getByTestId('short-logo-icon')).toBeInTheDocument()
  expect(screen.getByTestId('compress-icon')).toBeInTheDocument()
  expect(screen.getByTestId('xmark-icon')).toBeInTheDocument()
})

test('calls closeModal when close button is clicked', async () => {
  render(<ModalHeader />)

  const closeButton = screen.getByTestId('xmark-icon')
  await userEvent.click(closeButton)

  expect(mockCloseModal).toHaveBeenCalled()
})

test('calls toggleExpanded when compress/expanded button is clicked', async () => {
  render(<ModalHeader />)

  const compressButton = screen.getByTestId('compress-icon')
  await userEvent.click(compressButton)

  expect(mockToggleExpanded).toHaveBeenCalled()
})
