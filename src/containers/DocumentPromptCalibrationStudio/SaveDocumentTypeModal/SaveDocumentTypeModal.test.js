
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { SaveDocumentTypeModal } from './SaveDocumentTypeModal'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/selectors/documentTypesListPage')

const mockOnSave = jest.fn()
const mockToggleModalVisibility = jest.fn()

const defaultProps = {
  onSave: mockOnSave,
  isDisabled: false,
  isLoading: false,
  isVisible: true,
  toggleModalVisibility: mockToggleModalVisibility,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders button with correct text', () => {
  render(<SaveDocumentTypeModal {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.SAVE_DOCUMENT_TYPE) })

  expect(button).toBeInTheDocument()
})

test('renders modal with correct title when visible is true', () => {
  render(<SaveDocumentTypeModal {...defaultProps} />)

  const modalTitle = screen.getByText(localize(Localization.CONFIRM_SAVE_DOCUMENT_TYPE))
  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  const confirmButton = screen.getByRole('button', { name: localize(Localization.CONFIRM) })

  expect(modalTitle).toBeInTheDocument()
  expect(cancelButton).toBeInTheDocument()
  expect(confirmButton).toBeInTheDocument()
})

test('does not render modal when visible is false', () => {
  const props = {
    ...defaultProps,
    isVisible: false,
  }

  render(<SaveDocumentTypeModal {...props} />)

  const button = screen.queryByRole('button', { name: localize(Localization.CONFIRM) })

  expect(button).not.toBeInTheDocument()
})

test('disables button when isDisabled is true', () => {
  const props = {
    ...defaultProps,
    isDisabled: true,
  }

  render(<SaveDocumentTypeModal {...props} />)

  const button = screen.getByRole('button', { name: localize(Localization.SAVE_DOCUMENT_TYPE) })

  expect(button).toBeDisabled()
})

test('calls onSave with correct parameters when Confirm button is clicked', async () => {
  jest.clearAllMocks()

  render(<SaveDocumentTypeModal {...defaultProps} />)

  const confirmButton = screen.getByRole('button', { name: localize(Localization.CONFIRM) })
  await userEvent.click(confirmButton)

  await waitFor(() => {
    expect(mockOnSave).toHaveBeenCalledTimes(1)
  })
})

test('calls setIsVisible when Cancel button is clicked', async () => {
  jest.clearAllMocks()

  render(<SaveDocumentTypeModal {...defaultProps} />)

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  await userEvent.click(cancelButton)

  expect(mockToggleModalVisibility).toHaveBeenCalledTimes(1)
})

test('disables cancel button when isLoading is true', () => {
  const props = {
    ...defaultProps,
    isLoading: true,
  }

  render(<SaveDocumentTypeModal {...props} />)

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })

  expect(cancelButton).toBeDisabled()
})

test('calls toggleModalVisibility when trigger button is clicked', async () => {
  jest.clearAllMocks()

  const props = {
    ...defaultProps,
    isVisible: false,
  }

  render(<SaveDocumentTypeModal {...props} />)

  const button = screen.getByRole('button', { name: localize(Localization.SAVE_DOCUMENT_TYPE) })
  await userEvent.click(button)

  expect(mockToggleModalVisibility).toHaveBeenCalled()
})

test('renders checkbox with correct text when modal is visible', () => {
  render(<SaveDocumentTypeModal {...defaultProps} />)

  const checkbox = screen.getByRole('checkbox')
  const checkboxLabel = screen.getByText(localize(Localization.PERFORM_RE_EXTRACTION_MESSAGE))

  expect(checkbox).toBeInTheDocument()
  expect(checkboxLabel).toBeInTheDocument()
})

test('checkbox is checked by default', () => {
  render(<SaveDocumentTypeModal {...defaultProps} />)

  const checkbox = screen.getByRole('checkbox')

  expect(checkbox).toBeChecked()
})

test('changes checkbox state when clicked', async () => {
  render(<SaveDocumentTypeModal {...defaultProps} />)

  const checkbox = screen.getByRole('checkbox')

  expect(checkbox).toBeChecked()

  await userEvent.click(checkbox)

  expect(checkbox).not.toBeChecked()
})

test('calls onSave with true when Confirm button is clicked and checkbox is checked', async () => {
  jest.clearAllMocks()

  render(<SaveDocumentTypeModal {...defaultProps} />)

  const confirmButton = screen.getByRole('button', { name: localize(Localization.CONFIRM) })
  await userEvent.click(confirmButton)

  await waitFor(() => {
    expect(mockOnSave).toHaveBeenCalledWith(true)
  })
})
