
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { mockReactRedux } from '@/mocks/mockReactRedux'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fetchDocumentTypes } from '@/actions/documentTypes'
import { useCreateDocumentFromFileMutation } from '@/apiRTK/filesApi'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { FileStatus } from '@/enums/FileStatus'
import { Localization, localize } from '@/localization/i18n'
import { DocumentType } from '@/models/DocumentType'
import {
  File,
  FileReference,
  FileState,
} from '@/models/File'
import { documentTypesSelector } from '@/selectors/documentTypesListPage'
import { areTypesFetchingSelector } from '@/selectors/requests'
import { render } from '@/utils/rendererRTL'
import { AssignDocumentTypeToFileButton } from './AssignDocumentTypeToFileButton'

jest.mock('@/utils/env', () => mockEnv)
jest.mock('react-redux', () => mockReactRedux)
jest.mock('@/utils/notification', () => mockNotification)
jest.mock('@/actions/documentTypes')
jest.mock('@/selectors/documentTypesListPage')
jest.mock('@/selectors/requests')

const mockCreateDocumentFromFile = jest.fn()
const mockUnwrap = jest.fn()
const mockFetchDocumentTypesGroupQuery = jest.fn()

jest.mock('@/apiRTK/filesApi', () => ({
  useCreateDocumentFromFileMutation: jest.fn(() => [
    mockCreateDocumentFromFile,
    { isLoading: false },
  ]),
}))

jest.mock('@/apiRTK/documentTypesGroupsApi', () => ({
  useFetchDocumentTypesGroupQuery: jest.fn((...args) => mockFetchDocumentTypesGroupQuery(...args)),
}))

jest.mock('./AssignDocumentTypeToFileButton.styles', () => ({
  StyledSelectOptionModalButton: ({
    children,
    disabled,
    onSave,
    options,
    fetching,
    title,
  }) => (
    <div data-testid="select-option-modal">
      <div data-testid="modal-title">{title}</div>
      <div data-testid="options-count">{options.length}</div>
      <div data-testid="fetching-state">{String(fetching)}</div>
      <div data-testid="disabled-state">{String(disabled)}</div>
      <button
        data-testid="save-button"
        onClick={() => onSave('Invoice')}
      >
        {children}
      </button>
    </div>
  ),
}))

const mockDocumentTypes = [
  new DocumentType('Invoice', 'Invoice', 'tesseract'),
  new DocumentType('Receipt', 'Receipt', 'tesseract'),
  new DocumentType('Contract', 'Contract', 'tesseract'),
]

const mockFile = new File({
  id: 'file-1',
  tenantId: 'tenant-1',
  name: 'test.pdf',
  path: 'path/test.pdf',
  state: new FileState({
    status: FileStatus.COMPLETED,
    errorMessage: null,
  }),
  processingParams: {
    groupId: 'group-1',
    splittingEnabled: false,
    classificationEnabled: false,
    workflowParams: {
      documentTypeId: '',
    },
  },
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  labels: [],
})

describe('AssignDocumentTypeToFileButton', () => {
  let defaultProps
  let mockDispatch

  beforeEach(() => {
    jest.clearAllMocks()

    useCreateDocumentFromFileMutation.mockReturnValue([
      mockCreateDocumentFromFile,
      { isLoading: false },
    ])

    mockDispatch = jest.fn()
    mockReactRedux.useDispatch.mockReturnValue(mockDispatch)

    mockReactRedux.useSelector.mockImplementation((selector) => {
      if (selector === documentTypesSelector) {
        return mockDocumentTypes
      }
      if (selector === areTypesFetchingSelector) {
        return false
      }
      return undefined
    })

    mockFetchDocumentTypesGroupQuery.mockReturnValue({
      data: null,
    })

    mockCreateDocumentFromFile.mockReturnValue({
      unwrap: mockUnwrap,
    })

    mockUnwrap.mockResolvedValue({})

    defaultProps = {
      children: localize(Localization.ASSIGN_DOCUMENT_TYPE),
      file: {
        ...mockFile,
        processingParams: {
          ...mockFile.processingParams,
          workflowParams: {
            ...mockFile.processingParams.workflowParams,
          },
        },
      },
    }
  })

  test('renders with correct title', () => {
    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const title = screen.getByTestId('modal-title')
    expect(title).toHaveTextContent(localize(Localization.ASSIGN_DOCUMENT_TYPE_TO_FILE))
  })

  test('dispatches fetchDocumentTypes on mount', () => {
    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    expect(mockDispatch).toHaveBeenCalledWith(fetchDocumentTypes())
  })

  test('displays all document types when no group filter', () => {
    mockFetchDocumentTypesGroupQuery.mockReturnValue({
      data: null,
    })

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const optionsCount = screen.getByTestId('options-count')
    expect(optionsCount).toHaveTextContent(String(mockDocumentTypes.length))
  })

  test('filters document types by groupId when group data is available', () => {
    const groupDocumentTypeIds = ['Invoice', 'Receipt']

    mockFetchDocumentTypesGroupQuery.mockReturnValue({
      data: {
        group: {
          documentTypeIds: groupDocumentTypeIds,
        },
      },
    })

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const optionsCount = screen.getByTestId('options-count')
    expect(optionsCount).toHaveTextContent(String(groupDocumentTypeIds.length))
  })

  test('queries document types group when groupId exists', () => {
    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    expect(mockFetchDocumentTypesGroupQuery).toHaveBeenCalledWith(
      { groupId: mockFile.processingParams.groupId },
      { skip: false },
    )
  })

  test('calls createDocumentFromFile mutation with correct parameters', async () => {
    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const saveButton = screen.getByTestId('save-button')
    saveButton.click()

    expect(mockCreateDocumentFromFile).toHaveBeenCalledWith({
      fileId: mockFile.id,
      documentTypeId: 'Invoice',
    })
  })

  test('shows success notification on successful assignment', async () => {
    mockUnwrap.mockResolvedValue({})

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const saveButton = screen.getByTestId('save-button')
    saveButton.click()

    await screen.findByTestId('save-button')

    expect(mockNotification.notifySuccess).toHaveBeenCalledWith(
      localize(Localization.ASSIGN_DOCUMENT_TYPE_SUCCESSFUL),
    )
  })

  test('shows warning notification on assignment failure', async () => {
    mockUnwrap.mockRejectedValue({
      data: { code: 'UNKNOWN_ERROR' },
    })

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const saveButton = screen.getByTestId('save-button')
    saveButton.click()

    await screen.findByTestId('save-button')

    expect(mockNotification.notifyWarning).toHaveBeenCalledWith(
      localize(Localization.ASSIGN_DOCUMENT_TYPE_FAILED),
    )
  })

  test('shows specific error message for known error codes', async () => {
    const errorCode = 'file_not_found'
    mockUnwrap.mockRejectedValue({
      data: { code: errorCode },
    })

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const saveButton = screen.getByTestId('save-button')
    saveButton.click()

    await screen.findByTestId('save-button')

    expect(mockNotification.notifyWarning).toHaveBeenCalledWith(
      RESOURCE_ERROR_TO_DISPLAY[errorCode],
    )
  })

  test('shows default error message when error code is not recognized', async () => {
    mockUnwrap.mockRejectedValue({
      data: { code: 'UNRECOGNIZED_ERROR' },
    })

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const saveButton = screen.getByTestId('save-button')
    saveButton.click()

    await screen.findByTestId('save-button')

    expect(mockNotification.notifyWarning).toHaveBeenCalledWith(
      localize(Localization.ASSIGN_DOCUMENT_TYPE_FAILED),
    )
  })

  test('shows fetching state when types are being fetched', () => {
    mockReactRedux.useSelector.mockImplementation((selector) => {
      if (selector === documentTypesSelector) {
        return mockDocumentTypes
      }
      if (selector === areTypesFetchingSelector) {
        return true
      }
      return undefined
    })

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const fetchingState = screen.getByTestId('fetching-state')
    expect(fetchingState).toHaveTextContent('true')
  })

  test('shows fetching state when assignment is loading', () => {
    useCreateDocumentFromFileMutation.mockReturnValue([
      mockCreateDocumentFromFile,
      { isLoading: true },
    ])

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const fetchingState = screen.getByTestId('fetching-state')
    expect(fetchingState).toHaveTextContent('true')
  })

  test('renders disabled button when file has reference', () => {
    defaultProps.file.reference = new FileReference({
      entityType: 'document',
      entityId: 'doc-123',
      entityName: 'Test Document',
    })

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const disabledState = screen.getByTestId('disabled-state')
    expect(disabledState).toHaveTextContent('true')
  })

  test('renders enabled button when file has no reference', () => {
    defaultProps.file.reference = null

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const disabledState = screen.getByTestId('disabled-state')
    expect(disabledState).toHaveTextContent('false')
  })

  test('shows tooltip with reference unavailable message when file has reference', async () => {
    defaultProps.file.reference = new FileReference({
      entityType: 'document',
      entityId: 'doc-123',
      entityName: 'Test Document',
    })

    render(<AssignDocumentTypeToFileButton {...defaultProps} />)

    const button = screen.getByTestId('select-option-modal')
    await userEvent.hover(button)

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveTextContent(
        localize(Localization.FILE_ACTION_UNAVAILABLE_REFERENCE_TOOLTIP),
      )
    })
  })
})
