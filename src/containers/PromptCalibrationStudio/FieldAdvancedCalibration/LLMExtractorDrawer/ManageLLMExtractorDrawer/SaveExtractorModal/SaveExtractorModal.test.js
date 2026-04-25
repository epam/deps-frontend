
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { SaveExtractorModal } from './SaveExtractorModal'

jest.mock('@/utils/env', () => mockEnv)

const mockOnClose = jest.fn()
const mockOnCreateNew = jest.fn()
const mockOnEditExisting = jest.fn(() => Promise.resolve())

const defaultProps = {
  isVisible: true,
  isLoading: false,
  onClose: mockOnClose,
  onCreateNew: mockOnCreateNew,
  onEditExisting: mockOnEditExisting,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders modal with correct title when visible', () => {
  render(<SaveExtractorModal {...defaultProps} />)

  const title = screen.getByText(localize(Localization.CONFIRM_SAVE_EXTRACTOR_CHANGES))

  expect(title).toBeInTheDocument()
})

test('renders all action buttons', () => {
  render(<SaveExtractorModal {...defaultProps} />)

  const cancelButton = screen.getByRole('button', {
    name: localize(Localization.CANCEL),
  })
  const createNewButton = screen.getByRole('button', {
    name: localize(Localization.CREATE_NEW_EXTRACTOR),
  })
  const editExistingButton = screen.getByRole('button', {
    name: localize(Localization.EDIT_EXISTING_EXTRACTOR),
  })

  expect(cancelButton).toBeInTheDocument()
  expect(createNewButton).toBeInTheDocument()
  expect(editExistingButton).toBeInTheDocument()
})

test('calls onClose when Cancel button is clicked', async () => {
  render(<SaveExtractorModal {...defaultProps} />)

  const cancelButton = screen.getByRole('button', {
    name: localize(Localization.CANCEL),
  })

  await userEvent.click(cancelButton)

  expect(mockOnClose).toHaveBeenCalledTimes(1)
})

test('calls onCreateNew when Create New Extractor button is clicked', async () => {
  render(<SaveExtractorModal {...defaultProps} />)

  const createNewButton = screen.getByRole('button', {
    name: localize(Localization.CREATE_NEW_EXTRACTOR),
  })

  await userEvent.click(createNewButton)

  expect(mockOnCreateNew).toHaveBeenCalledTimes(1)
})

test('calls onEditExisting when Edit Existing Extractor button is clicked', async () => {
  render(<SaveExtractorModal {...defaultProps} />)

  const editExistingButton = screen.getByRole('button', {
    name: localize(Localization.EDIT_EXISTING_EXTRACTOR),
  })

  await userEvent.click(editExistingButton)

  expect(mockOnEditExisting).toHaveBeenCalledTimes(1)
})

test('disables Cancel button when isLoading is true', () => {
  const props = {
    ...defaultProps,
    isLoading: true,
  }

  render(<SaveExtractorModal {...props} />)

  const cancelButton = screen.getByRole('button', {
    name: localize(Localization.CANCEL),
  })

  expect(cancelButton).toBeDisabled()
})

test('disables Create New Extractor button when isLoading is true', () => {
  const props = {
    ...defaultProps,
    isLoading: true,
  }

  render(<SaveExtractorModal {...props} />)

  const createNewButton = screen.getByRole('button', {
    name: localize(Localization.CREATE_NEW_EXTRACTOR),
  })

  expect(createNewButton).toBeDisabled()
})

test('does not render modal when isVisible is false', () => {
  const props = {
    ...defaultProps,
    isVisible: false,
  }

  render(<SaveExtractorModal {...props} />)

  const title = screen.queryByText(localize(Localization.CONFIRM_SAVE_EXTRACTOR_CHANGES))

  expect(title).not.toBeInTheDocument()
})
