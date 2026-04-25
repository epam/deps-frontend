
import { mockEnv } from '@/mocks/mockEnv'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { Localization, localize } from '@/localization/i18n'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { render } from '@/utils/rendererRTL'
import { CommitDocumentTypeModal } from './CommitDocumentTypeModal'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/selectors/requests')
jest.mock('@/actions/documentTypes', () => ({
  fetchDocumentTypes: jest.fn(() => ({ type: 'FETCH_DOCUMENT_TYPES' })),
}))
jest.mock('lodash/debounce', () =>
  jest.fn((fn) => {
    fn.cancel = jest.fn()
    return fn
  }),
)

jest.mock('react-redux', () => ({
  ...mockReactRedux,
  useDispatch: jest.fn(() => mockDispatch),
}))

const mockDispatch = jest.fn()
const mockOnCommit = jest.fn()
const mockToggleModalVisibility = jest.fn()

const defaultProps = {
  onCommit: mockOnCommit,
  isDisabled: false,
  isLoading: false,
  isVisible: true,
  toggleModalVisibility: mockToggleModalVisibility,
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders button with correct text', () => {
  render(<CommitDocumentTypeModal {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.SAVE_TO_DOCUMENT_TYPE) })

  expect(button).toBeInTheDocument()
})

test('renders modal with correct title when visible is true', () => {
  render(<CommitDocumentTypeModal {...defaultProps} />)

  const modalTitle = screen.getByText(localize(Localization.CONFIRM_SAVE_TO_DOCUMENT_TYPE))
  const documentTypeNameLabel = screen.getByText(localize(Localization.DOCUMENT_TYPE_NAME))
  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  const confirmButton = screen.getByRole('button', { name: localize(Localization.CONFIRM) })

  expect(modalTitle).toBeInTheDocument()
  expect(documentTypeNameLabel).toBeInTheDocument()
  expect(cancelButton).toBeInTheDocument()
  expect(confirmButton).toBeInTheDocument()
})

test('does not render modal when visible is false', () => {
  const props = {
    ...defaultProps,
    isVisible: false,
  }

  render(<CommitDocumentTypeModal {...props} />)

  const button = screen.queryByRole('button', { name: localize(Localization.CONFIRM) })

  expect(button).not.toBeInTheDocument()
})

test('disables button when isDisabled is true', () => {
  const props = {
    ...defaultProps,
    isDisabled: true,
  }

  render(<CommitDocumentTypeModal {...props} />)

  const button = screen.getByRole('button', { name: localize(Localization.SAVE_TO_DOCUMENT_TYPE) })

  expect(button).toBeDisabled()
})

test('disables confirm button when document type name is empty', () => {
  render(<CommitDocumentTypeModal {...defaultProps} />)

  const button = screen.getByRole('button', { name: localize(Localization.CONFIRM) })

  expect(button).toBeDisabled()
})

test('enables confirm button when document type name is entered', async () => {
  render(<CommitDocumentTypeModal {...defaultProps} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  await userEvent.type(input, 'Test Document Type')

  const button = screen.getByRole('button', { name: localize(Localization.CONFIRM) })
  expect(button).not.toBeDisabled()
})

test('calls onCommit with correct parameters when Confirm button is clicked', async () => {
  jest.clearAllMocks()

  render(<CommitDocumentTypeModal {...defaultProps} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  await userEvent.type(input, 'Test Document Type')

  const confirmButton = screen.getByRole('button', { name: localize(Localization.CONFIRM) })
  await userEvent.click(confirmButton)

  await waitFor(() => {
    expect(mockOnCommit).toHaveBeenNthCalledWith(1, 'Test Document Type')
  })
})

test('calls setIsVisible when Cancel button is clicked', async () => {
  jest.clearAllMocks()

  render(<CommitDocumentTypeModal {...defaultProps} />)

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  await userEvent.click(cancelButton)

  expect(mockToggleModalVisibility).toHaveBeenCalledTimes(1)
})

test('clears input when Cancel button is clicked', async () => {
  render(<CommitDocumentTypeModal {...defaultProps} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  await userEvent.type(input, 'Test Document Type')

  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })
  await userEvent.click(cancelButton)

  const button = screen.getByRole('button', { name: localize(Localization.SAVE_TO_DOCUMENT_TYPE) })
  await userEvent.click(button)

  const newInput = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  expect(newInput.value).toBe('')
})

test('disables all controls when isLoading is true', () => {
  const props = {
    ...defaultProps,
    isLoading: true,
  }

  render(<CommitDocumentTypeModal {...props} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  const cancelButton = screen.getByRole('button', { name: localize(Localization.CANCEL) })

  expect(input).toBeDisabled()
  expect(cancelButton).toBeDisabled()
})

test('submits on Enter key press when name is valid', async () => {
  jest.clearAllMocks()

  render(<CommitDocumentTypeModal {...defaultProps} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  await userEvent.type(input, 'Test Document Type{Enter}')

  await waitFor(() => {
    expect(mockOnCommit).toHaveBeenCalledWith('Test Document Type')
  })
})

test('does not submit on Enter key press when name is empty', async () => {
  jest.clearAllMocks()

  render(<CommitDocumentTypeModal {...defaultProps} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  await userEvent.type(input, '{Enter}')

  expect(mockOnCommit).not.toHaveBeenCalled()
})

test('validates document type name and disables button when name already exists', async () => {
  render(<CommitDocumentTypeModal {...defaultProps} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  await userEvent.type(input, 'Test Type 1')

  await waitFor(() => {
    const confirmButton = screen.getByRole('button', { name: localize(Localization.CONFIRM) })
    expect(confirmButton).toBeDisabled()
  })
})

test('shows error message when document type name already exists', async () => {
  render(<CommitDocumentTypeModal {...defaultProps} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  await userEvent.type(input, 'Test Type 1')

  await waitFor(() => {
    const errorMessage = screen.getByText(localize(Localization.DOCUMENT_TYPE_NAME_ALREADY_EXISTS))
    expect(errorMessage).toBeInTheDocument()
  })
})

test('does not call onCommit when name is duplicate', async () => {
  jest.clearAllMocks()

  render(<CommitDocumentTypeModal {...defaultProps} />)

  const input = screen.getByPlaceholderText(localize(Localization.DOCUMENT_TYPE_NAME_TEXT))
  await userEvent.type(input, 'Test Type 1')
  await userEvent.tab()

  const confirmButton = screen.getByRole('button', { name: localize(Localization.CONFIRM) })
  await userEvent.click(confirmButton)

  await waitFor(() => {
    expect(mockOnCommit).not.toHaveBeenCalled()
  })
})

test('calls toggleModalVisibility when trigger button is clicked', async () => {
  jest.clearAllMocks()

  const props = {
    ...defaultProps,
    isVisible: false,
  }

  render(<CommitDocumentTypeModal {...props} />)

  const button = screen.getByRole('button', { name: localize(Localization.SAVE_TO_DOCUMENT_TYPE) })
  await userEvent.click(button)

  expect(mockToggleModalVisibility).toHaveBeenCalled()
})

test('dispatches fetchDocumentTypes when document types are empty', () => {
  jest.clearAllMocks()

  documentTypesSelector.mockReturnValueOnce([])

  render(<CommitDocumentTypeModal {...defaultProps} />)

  expect(mockDispatch).toHaveBeenCalledWith(fetchDocumentTypes())
})

test('does not dispatch fetchDocumentTypes when document types exist', () => {
  jest.clearAllMocks()

  render(<CommitDocumentTypeModal {...defaultProps} />)

  expect(mockDispatch).not.toHaveBeenCalledWith(fetchDocumentTypes())
})

test('shows loading spinner when document types are fetching', () => {
  jest.clearAllMocks()

  areTypesFetchingSelector.mockReturnValueOnce(true)

  render(<CommitDocumentTypeModal {...defaultProps} />)

  const [spinner] = screen.getAllByTestId('spin')

  expect(spinner).toBeInTheDocument()
})
