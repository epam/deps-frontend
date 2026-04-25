
import { mockEnv } from '@/mocks/mockEnv'
import { waitFor } from '@testing-library/dom'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useContext } from 'react'
import { render } from '@/utils/rendererRTL'
import { BatchSettings, SplittableFile } from '../viewModels'
import { FilesSplittingContext, FilesSplittingProvider } from './FilesSplittingProvider'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/PdfSplitting', () => ({
  PdfSplitter: {},
}))

const mockBatchFiles = [
  new File(['content'], 'test1.pdf', { type: 'application/pdf' }),
  new File(['content'], 'test2.txt', { type: 'application/pdf' }),
  new File(['content'], 'test3.txt', { type: 'application/pdf' }),
  new File(['content'], 'test4.pdf', { type: 'application/pdf' }),
]

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

const mockSplittableFile = new SplittableFile({
  source: mockBatchFiles[0],
  segments: [],
  batchName: 'batch-name',
})

const mockAddBatchFilesBtn = 'Add batch files'
const mockAddSplittableFileBtn = 'Add splittable file'
const mockSetCurrentFileIndexBtn = 'Set current file index'

const MockComponent = () => {
  const {
    batchSettings,
    setBatchFiles,
    batchFiles,
    splittableFiles,
    currentFileIndex,
    setCurrentFileIndex,
    setSplittableFile,
  } = useContext(FilesSplittingContext)

  return (
    <div>
      <p>
        {batchFiles.length}
      </p>
      <p>
        {splittableFiles?.length}
      </p>
      <p>
        {batchSettings?.engine}
      </p>
      <p>
        {splittableFiles[currentFileIndex]?.source?.name}
      </p>
      <button onClick={() => setBatchFiles(mockBatchFiles)}>
        {mockAddBatchFilesBtn}
      </button>
      <button onClick={() => setSplittableFile([...splittableFiles, mockSplittableFile])}>
        {mockAddSplittableFileBtn}
      </button>
      <button onClick={() => setCurrentFileIndex(1)}>
        {mockSetCurrentFileIndexBtn}
      </button>
    </div>
  )
}

test('provides context values to children', async () => {
  const defaultProps = {
    files: mockBatchFiles,
    settings: mockBatchSettings,
  }

  render(
    <FilesSplittingProvider {...defaultProps}>
      <MockComponent />
    </FilesSplittingProvider>,
  )

  await waitFor(() => {
    const batchFilesLength = screen.getByText(mockBatchFiles.length)
    expect(batchFilesLength).toBeInTheDocument()
  })

  await waitFor(() => {
    const batchSettingsId = screen.getByText(mockBatchSettings.engine)
    expect(batchSettingsId).toBeInTheDocument()
  })

  await waitFor(() => {
    const splittableFileBatchName = screen.getByText(mockSplittableFile.source.name)
    expect(splittableFileBatchName).toBeInTheDocument()
  })
})

test('adds batch files when click on add batch files button', async () => {
  const expectedBatchFilesLength = 4

  const defaultProps = {
    files: mockBatchFiles,
    settings: mockBatchSettings,
  }

  render(
    <FilesSplittingProvider {...defaultProps}>
      <MockComponent />
    </FilesSplittingProvider>,
  )

  const addBatchFilesBtn = screen.getByRole('button', { name: mockAddBatchFilesBtn })
  await userEvent.click(addBatchFilesBtn)

  await waitFor(() => {
    const batchFilesLength = screen.getByText(expectedBatchFilesLength)
    expect(batchFilesLength).toBeInTheDocument()
  })
})

test('adds splittable file when click on add splittable file button', async () => {
  const expectedSplittableFileLength = 3

  const defaultProps = {
    files: mockBatchFiles,
    settings: mockBatchSettings,
  }

  render(
    <FilesSplittingProvider {...defaultProps}>
      <MockComponent />
    </FilesSplittingProvider>,
  )

  const addSplittableFileBtn = screen.getByRole('button', { name: mockAddSplittableFileBtn })
  await userEvent.click(addSplittableFileBtn)

  await waitFor(() => {
    const splittableFileLength = screen.getByText(expectedSplittableFileLength)
    expect(splittableFileLength).toBeInTheDocument()
  })
})

test('sets current file index when click on set current file index button', async () => {
  const defaultProps = {
    files: mockBatchFiles,
    settings: mockBatchSettings,
  }

  render(
    <FilesSplittingProvider {...defaultProps}>
      <MockComponent />
    </FilesSplittingProvider>,
  )

  const currentFileName = screen.queryByText(mockBatchFiles[0].name)
  expect(currentFileName).toBeInTheDocument()

  const setCurrentFileIndexBtn = screen.getByRole('button', { name: mockSetCurrentFileIndexBtn })
  await userEvent.click(setCurrentFileIndexBtn)

  await waitFor(() => {
    const updatedCurrentFileName = screen.getByText(mockBatchFiles[3].name)
    expect(updatedCurrentFileName).toBeInTheDocument()
  })
})

test('renders children correctly', () => {
  const defaultProps = {
    files: mockBatchFiles,
    settings: mockBatchSettings,
  }

  const mockTestId = 'test-id'

  render(
    <FilesSplittingProvider {...defaultProps}>
      <div data-testid={mockTestId} />
    </FilesSplittingProvider>,
  )

  expect(screen.getByTestId(mockTestId)).toBeInTheDocument()
})
