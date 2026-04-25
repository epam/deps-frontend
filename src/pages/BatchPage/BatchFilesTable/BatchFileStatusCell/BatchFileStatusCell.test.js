
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BatchFileStatus, RESOURCE_BATCH_FILE_STATUS } from '@/enums/BatchFileStatus'
import { RESOURCE_ERROR_TO_DISPLAY } from '@/enums/Errors'
import { localize, Localization } from '@/localization/i18n'
import { BatchFile } from '@/models/Batch'
import { render } from '@/utils/rendererRTL'
import { BatchFileStatusCell } from './BatchFileStatusCell'

jest.mock('@/utils/env', () => mockEnv)

const TEST_ID = {
  WARNING_ICON: 'warning-icon',
}

const file = new BatchFile({
  id: '1',
  name: 'file1.txt',
  status: BatchFileStatus.NEW,
  error: {
    code: 'file_not_found',
    message: 'Some error message ',
  },
})

const fileWithUnknownErrorForFrontend = new BatchFile({
  id: '1',
  name: 'file1.txt',
  status: BatchFileStatus.NEW,
  error: {
    code: 'new_unknown_error_code_for_fe',
    message: 'New unknown error message for frontend',
  },
})

const fileWithoutError = new BatchFile({
  id: '2',
  name: 'file2.txt',
  status: BatchFileStatus.NEW,
})

test('renders correctly', async () => {
  render(<BatchFileStatusCell file={file} />)

  expect(screen.getByText(RESOURCE_BATCH_FILE_STATUS[BatchFileStatus.NEW])).toBeInTheDocument()
  const warningIcon = screen.getByTestId(TEST_ID.WARNING_ICON)

  await userEvent.hover(warningIcon)

  await waitFor(() => {
    expect(screen.getByText(RESOURCE_ERROR_TO_DISPLAY[file.error.code])).toBeInTheDocument()
  })
})

test('renders correctly with unknown error for frontend', async () => {
  render(<BatchFileStatusCell file={fileWithUnknownErrorForFrontend} />)

  const warningIcon = screen.getByTestId(TEST_ID.WARNING_ICON)

  await userEvent.hover(warningIcon)

  await waitFor(() => {
    expect(screen.getByText(localize(Localization.DEFAULT_ERROR))).toBeInTheDocument()
  })
})

test('does not show warning icon when file has no error', () => {
  render(<BatchFileStatusCell file={fileWithoutError} />)
  expect(screen.getByText(RESOURCE_BATCH_FILE_STATUS[BatchFileStatus.NEW])).toBeInTheDocument()
  expect(screen.queryByTestId(TEST_ID.WARNING_ICON)).not.toBeInTheDocument()
})
