
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { useFetchFileQuery } from '@/apiRTK/filesApi'
import { FileStatus } from '@/enums/FileStatus'
import { File, FileState } from '@/models/File'
import { navigationMap } from '@/utils/navigationMap'
import { render } from '@/utils/rendererRTL'
import { FileViewHeader } from './FileViewHeader'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('react-router', () => ({
  useParams: jest.fn(() => ({ fileId: 'mockFileId' })),
}))

jest.mock('@/apiRTK/filesApi', () => ({
  useFetchFileQuery: jest.fn(),
}))

jest.mock('@/containers/BackToSourceButton', () => ({
  BackToSourceButton: ({ sourcePath }) => (
    <div data-testid="back-to-source">
      {sourcePath}
    </div>
  ),
}))

jest.mock('@/containers/FileReviewControls', () => ({
  FileReviewControls: () => (
    <div data-testid="file-review-controls">
      FileReviewControls
    </div>
  ),
}))

jest.mock('@/containers/LongLabelsList', () => ({
  LongLabelsList: ({ labels }) => (
    <div data-testid="long-labels">
      {labels.map((l) => l.name).join(', ')}
    </div>
  ),
}))

jest.mock('./FileViewHeader.styles', () => ({
  ...jest.requireActual('./FileViewHeader.styles'),
  CommandsSeparator: () => <div data-testid="commands-separator" />,
}))

jest.mock('./FileNavigationTitle', () => ({
  FileNavigationTitle: () => (
    <div data-testid="file-navigation-title">
      test-file.pdf
    </div>
  ),
}))

const mockFile = new File({
  id: 'mockFileId',
  tenantId: 'mockTenantId',
  name: 'test-file.pdf',
  path: 'test-path.pdf',
  state: new FileState({
    status: FileStatus.COMPLETED,
    errorMessage: null,
  }),
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  labels: ['label1', 'label2', 'label3'],
})

beforeEach(() => {
  useFetchFileQuery.mockReturnValue({
    data: mockFile,
  })
})

test('renders essential elements (BackToSourceButton, FileNavigationTitle, FileReviewControls)', () => {
  render(<FileViewHeader />)

  expect(screen.getByTestId('back-to-source')).toBeInTheDocument()
  expect(screen.getByTestId('file-navigation-title')).toHaveTextContent('test-file.pdf')
  expect(screen.getByTestId('file-review-controls')).toBeInTheDocument()
})

test('renders LongLabelsList and CommandsSeparator when labels exist', () => {
  const fileWithLabels = new File({
    ...mockFile,
    labels: ['label', 'label-2'],
  })

  useFetchFileQuery.mockReturnValue({
    data: fileWithLabels,
  })

  render(<FileViewHeader />)

  expect(screen.getByTestId('long-labels')).toBeInTheDocument()
  expect(screen.getByTestId('commands-separator')).toBeInTheDocument()
})

test('does not render LongLabelsList or CommandsSeparator when no labels exist', () => {
  const fileWithoutLabels = new File({
    ...mockFile,
    labels: [],
  })

  useFetchFileQuery.mockReturnValue({
    data: fileWithoutLabels,
  })

  render(<FileViewHeader />)

  expect(screen.queryByTestId('long-labels')).not.toBeInTheDocument()
  expect(screen.queryByTestId('commands-separator')).not.toBeInTheDocument()
})

test('passes correct sourcePath prop to BackToSourceButton', () => {
  render(<FileViewHeader />)

  const expectedPath = navigationMap.files()
  expect(screen.getByTestId('back-to-source')).toHaveTextContent(expectedPath)
})
