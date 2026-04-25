
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Localization, localize } from '@/localization/i18n'
import { render } from '@/utils/rendererRTL'
import { MAX_FILES_COUNT_FOR_ONE_BATCH } from './constants'
import { useFilesSplitting } from './hooks'
import { BatchSettings, SplittableFile } from './viewModels'
import { BatchFilesSplittingDrawer } from '.'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PdfSplitting', () => ({
  PdfSplitter: {
    getSplittedFilesData: jest.fn().mockResolvedValue([]),
  },
  PdfSplittingLayout: () => <div>{mockPdfSplittingLayout}</div>,
}))

jest.mock('./hooks', () => ({
  useFilesSplitting: jest.fn(() => ({
    splittableFiles: [mockSplittableFile],
    batchFiles: [mockBatchFile],
    currentFileIndex: 0,
    setCurrentFileIndex: mockSetCurrentFileIndex,
    setSplittableFile: jest.fn(),
    batchSettings: mockBatchSettings,
  })),
}))

const mockSplittableFile = new SplittableFile({
  id: '1',
  source: {
    name: 'file1.pdf',
  },
  segments: [],
  batchName: 'batch1',
})

const mockBatchSettings = new BatchSettings({
  group: {
    id: 'group-id',
    name: 'group-name',
    documentTypeIds: [],
  },
  llmType: 'llmType',
  engine: 'engine',
  parsingFeatures: [],
})

const mockSetCurrentFileIndex = jest.fn()
const mockPdfSplittingLayout = 'PdfSplittingLayout'
const mockBatchFile = new File(['content'], 'test1.pdf', { type: 'application/pdf' })

const defaultProps = {
  isVisible: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  settings: mockBatchSettings,
  files: [mockBatchFile],
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders BatchFilesSplittingDrawer correctly', () => {
  render(<BatchFilesSplittingDrawer {...defaultProps} />)

  const title = screen.getByText(localize(Localization.ONE_BATCH_SPLITTING))
  const fileName = screen.getByText(mockSplittableFile.source.name)
  const filesCounter = screen.getByText('1 / 50', { exact: false })
  const previousButton = screen.getByRole('button', { name: localize(Localization.PREVIOUS_STEP) })
  const uploadButton = screen.getByRole('button', { name: localize(Localization.UPLOAD) })

  expect(title).toBeInTheDocument()
  expect(fileName).toBeInTheDocument()
  expect(filesCounter).toBeInTheDocument()
  expect(previousButton).toBeInTheDocument()
  expect(uploadButton).toBeInTheDocument()
})

test('does not render drawer when isVisible is false', () => {
  render(
    <BatchFilesSplittingDrawer
      {...defaultProps}
      isVisible={false}
    />,
  )

  const drawer = screen.queryByTestId('drawer')

  expect(drawer).not.toBeInTheDocument()
})

test('calls close handler when Previous Step button is clicked', async () => {
  render(<BatchFilesSplittingDrawer {...defaultProps} />)

  const previousButton = screen.getByRole('button', { name: localize(Localization.PREVIOUS_STEP) })
  await userEvent.click(previousButton)

  expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  expect(mockSetCurrentFileIndex).toHaveBeenNthCalledWith(1, 0)
})

test('calls onSubmit when Upload button is clicked', async () => {
  render(<BatchFilesSplittingDrawer {...defaultProps} />)

  const uploadButton = screen.getByRole('button', { name: localize(Localization.UPLOAD) })
  await userEvent.click(uploadButton)

  await waitFor(() => {
    expect(defaultProps.onSubmit).toHaveBeenCalledWith([])
  })
})

test('calls close handler when Upload button is clicked', async () => {
  render(<BatchFilesSplittingDrawer {...defaultProps} />)

  const uploadButton = screen.getByRole('button', { name: localize(Localization.UPLOAD) })
  await userEvent.click(uploadButton)

  await waitFor(() => {
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  await waitFor(() => {
    expect(mockSetCurrentFileIndex).toHaveBeenNthCalledWith(1, 0)
  })
})

test('shows error message when upload files limit is exceeded', async () => {
  jest.clearAllMocks()

  const mockFiles = Array.from(
    { length: MAX_FILES_COUNT_FOR_ONE_BATCH + 1 },
    () => new File(['content'], 'test1.png', { type: 'application/pdf' }),
  )

  useFilesSplitting.mockImplementation(() => ({
    splittableFiles: [mockSplittableFile],
    currentFileIndex: 0,
    setSplittableFile: jest.fn(),
    batchSettings: mockBatchSettings,
    batchFiles: mockFiles,
  }))

  render(<BatchFilesSplittingDrawer {...defaultProps} />)

  await waitFor(() => {
    const errorMessage = screen.getByText(localize(Localization.FILES_LIMIT_EXCEEDED_COMBINE_OR_DIVIDE))
    expect(errorMessage).toBeInTheDocument()
  })
})

test('disables Upload button when upload files limit is exceeded', async () => {
  jest.clearAllMocks()

  const mockFiles = Array.from(
    { length: MAX_FILES_COUNT_FOR_ONE_BATCH + 1 },
    () => new File(['content'], 'test1.png', { type: 'application/pdf' }),
  )

  useFilesSplitting.mockImplementation(() => ({
    splittableFiles: [mockSplittableFile],
    currentFileIndex: 0,
    setSplittableFile: jest.fn(),
    batchSettings: mockBatchSettings,
    batchFiles: mockFiles,
  }))

  render(<BatchFilesSplittingDrawer {...defaultProps} />)

  await waitFor(() => {
    const uploadButton = screen.getByRole('button', { name: localize(Localization.UPLOAD) })
    expect(uploadButton).toBeDisabled()
  })
})
