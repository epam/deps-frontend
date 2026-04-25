
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BatchFileStatus } from '@/enums/BatchFileStatus'
import { BatchFile } from '@/models/Batch'
import { render } from '@/utils/rendererRTL'
import { FilesBatchCountTag } from './FilesBatchCountTag'

jest.mock('@/utils/env', () => mockEnv)

const TEST_ID = {
  FILES_ICON: 'files-icon',
  WARNING_ICON: 'warning-icon',
  TAG: 'tag',
}

const files = [
  new BatchFile({
    id: '1',
    name: '1',
    status: BatchFileStatus.NEW,
    error: null,
  }),
  new BatchFile({
    id: '2',
    name: '2',
    status: BatchFileStatus.NEW,
    error: null,
  }),
]

const filesWithErrors = [
  new BatchFile({
    id: '3',
    name: 'file1.txt',
    status: BatchFileStatus.FAILED,
    error: {
      code: 'file_not_found',
      message: 'File not found',
    },
  }),
  new BatchFile({
    id: '4',
    name: 'file2.txt',
    status: BatchFileStatus.FAILED,
    error: {
      code: 'new_unknown_error_code_for_fe',
      message: 'New unknown error message for frontend',
    },
  }),
]

test('renders files count without errors', () => {
  render(<FilesBatchCountTag files={files} />)

  const tag = screen.getByTestId(TEST_ID.TAG)
  const filesIcon = screen.getByTestId(TEST_ID.FILES_ICON)

  expect(tag).toBeInTheDocument()
  expect(filesIcon).toBeInTheDocument()
})

test('shows dropdown menu with error files on click', async () => {
  render(<FilesBatchCountTag files={filesWithErrors} />)

  const tag = screen.getByTestId(TEST_ID.TAG)
  await userEvent.click(tag)
  expect(screen.getByText('file1.txt')).toBeInTheDocument()
})

test('prevents event propagation on click', () => {
  const handleClick = jest.fn()
  render(
    <div onClick={handleClick}>
      <FilesBatchCountTag files={filesWithErrors} />
    </div>,
  )

  const tag = screen.getByTestId(TEST_ID.TAG)
  userEvent.click(tag)
  expect(handleClick).not.toHaveBeenCalled()
})
