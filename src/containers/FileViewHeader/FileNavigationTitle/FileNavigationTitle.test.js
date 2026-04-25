
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { FileReferenceType } from '@/enums/FileReferenceType'
import { FileStatus } from '@/enums/FileStatus'
import { File, FileReference, FileState } from '@/models/File'
import { render } from '@/utils/rendererRTL'
import { FileNavigationTitle } from './FileNavigationTitle'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'test-file-id' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileQuery: jest.fn(),
}))

jest.mock('./FileNavigationTitle.styles', () => ({
  Wrapper: ({ children }) => <div data-testid="wrapper">{children}</div>,
  FileDataWrapper: ({ children }) => <div data-testid="file-data-wrapper">{children}</div>,
  FileName: ({ text }) => <div data-testid="file-name">{text}</div>,
  InfoWrapper: ({ children }) => <div data-testid="info-wrapper">{children}</div>,
  FileStatus: ({ status }) => (
    <div
      data-status={status}
      data-testid="file-status"
    >
      {status}
    </div>
  ),
}))

jest.mock('../FileReferenceInfo', () => ({
  FileReferenceInfo: ({ reference }) => (
    <div data-testid="file-reference-info">
      <span>{reference.entityType}</span>
      <span>{reference.entityName}</span>
    </div>
  ),
}))

const createMockFile = (overrides = {}) => new File({
  id: '1',
  tenantId: '1',
  name: 'test-file.pdf',
  path: 'path/test-file.pdf',
  state: new FileState({
    status: FileStatus.COMPLETED,
    errorMessage: null,
  }),
  processingParams: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  labels: [],
  reference: new FileReference({
    entityType: FileReferenceType.BATCH,
    entityId: 'test-entity-id',
    entityName: 'test-entity-name',
  }),
  ...overrides,
})

describe('FileNavigationTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    useFetchFileQuery.mockReturnValue({
      data: createMockFile(),
    })
  })

  test('renders wrapper', () => {
    render(<FileNavigationTitle />)

    expect(screen.getByTestId('wrapper')).toBeInTheDocument()
  })

  test('renders file data wrapper', () => {
    render(<FileNavigationTitle />)

    expect(screen.getByTestId('file-data-wrapper')).toBeInTheDocument()
  })

  test('renders info wrapper', () => {
    render(<FileNavigationTitle />)

    expect(screen.getByTestId('info-wrapper')).toBeInTheDocument()
  })

  test('renders file name', () => {
    render(<FileNavigationTitle />)

    const fileName = screen.getByTestId('file-name')
    expect(fileName).toBeInTheDocument()
    expect(fileName).toHaveTextContent('test-file.pdf')
  })

  test('renders file status', () => {
    render(<FileNavigationTitle />)

    const fileStatus = screen.getByTestId('file-status')
    expect(fileStatus).toBeInTheDocument()
  })

  test('displays correct status value', () => {
    const file = createMockFile({
      state: new FileState({
        status: FileStatus.PROCESSING,
        errorMessage: null,
      }),
    })

    useFetchFileQuery.mockReturnValue({
      data: file,
    })

    render(<FileNavigationTitle />)

    const fileStatus = screen.getByTestId('file-status')
    expect(fileStatus).toHaveAttribute('data-status', FileStatus.PROCESSING)
  })

  test('renders file reference info', () => {
    const file = createMockFile()

    useFetchFileQuery.mockReturnValue({
      data: file,
    })

    render(<FileNavigationTitle />)

    const referenceType = screen.getByText(file.reference.entityType)
    const referenceName = screen.getByText(file.reference.entityName)

    expect(referenceType).toBeInTheDocument()
    expect(referenceName).toBeInTheDocument()
  })

  test('does not render file reference info if file has no reference', () => {
    const file = createMockFile({
      reference: null,
    })

    useFetchFileQuery.mockReturnValue({
      data: file,
    })

    render(<FileNavigationTitle />)

    const referenceInfo = screen.queryByTestId('file-reference-info')

    expect(referenceInfo).not.toBeInTheDocument()
  })
})
