
import { mockEnv } from '@/mocks/mockEnv'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { FileStatus } from '@/enums/FileStatus'
import { Localization, localize } from '@/localization/i18n'
import { File } from '@/models/File'
import { notifySuccess, notifyWarning } from '@/utils/notification'
import { render } from '@/utils/rendererRTL'
import { FileRestartButton } from './FileRestartButton'

jest.mock('@/utils/env', () => mockEnv)

const mockRestartFile = jest.fn()

jest.mock('@/apiRTK/filesApi', () => ({
  useRestartFileMutation: () => [
    mockRestartFile,
    { isLoading: false },
  ],
}))

jest.mock('@/components/Modal', () => ({
  Modal: {
    confirm: jest.fn(),
  },
}))

jest.mock('@/utils/notification')

let mockFile

beforeEach(() => {
  jest.clearAllMocks()

  mockFile = new File({
    id: 'test-file-id',
    name: 'test-file.pdf',
    tenantId: 'test-tenant-id',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    labels: [],
    state: {
      status: FileStatus.FAILED,
    },
  })

  mockRestartFile.mockReturnValue({
    unwrap: jest.fn().mockResolvedValue({}),
  })
})

test('renders button with localized text', () => {
  render(<FileRestartButton file={mockFile} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.RESTART_FILE),
  })

  expect(button).toBeInTheDocument()
})

test('stops event propagation when clicked', async () => {
  const user = userEvent.setup()
  const mockOnClick = jest.fn()

  render(
    <div onClick={mockOnClick}>
      <FileRestartButton file={mockFile} />
    </div>,
  )

  const button = screen.getByRole('button', {
    name: localize(Localization.RESTART_FILE),
  })

  await user.click(button)

  expect(mockOnClick).not.toHaveBeenCalled()
})

test('shows confirmation modal before restarting', async () => {
  const user = userEvent.setup()

  render(<FileRestartButton file={mockFile} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.RESTART_FILE),
  })

  await user.click(button)

  expect(Modal.confirm).toHaveBeenCalledWith(
    expect.objectContaining({
      title: localize(Localization.RESTART_FILE_CONFIRM_MESSAGE),
      onOk: expect.any(Function),
    }),
  )
})

test('calls restart mutation when confirmed', async () => {
  const user = userEvent.setup()

  Modal.confirm.mockImplementation(({ onOk }) => {
    onOk()
  })

  render(<FileRestartButton file={mockFile} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.RESTART_FILE),
  })

  await user.click(button)

  await waitFor(() => {
    expect(mockRestartFile).toHaveBeenCalledWith(mockFile.id)
  })
})

test('shows success notification on successful restart', async () => {
  const user = userEvent.setup()

  Modal.confirm.mockImplementation(({ onOk }) => {
    onOk()
  })

  render(<FileRestartButton file={mockFile} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.RESTART_FILE),
  })

  await user.click(button)

  await waitFor(() => {
    expect(notifySuccess).toHaveBeenCalledWith(
      localize(Localization.RESTART_FILE_SUCCESS),
    )
  })
})

test('shows error notification on failed restart', async () => {
  const user = userEvent.setup()

  mockRestartFile.mockReturnValue({
    unwrap: jest.fn().mockRejectedValue({
      data: { code: 'UNKNOWN_ERROR' },
    }),
  })

  Modal.confirm.mockImplementation(({ onOk }) => {
    onOk()
  })

  render(<FileRestartButton file={mockFile} />)

  const button = screen.getByRole('button', {
    name: localize(Localization.RESTART_FILE),
  })

  await user.click(button)

  await waitFor(() => {
    expect(notifyWarning).toHaveBeenCalledWith(
      localize(Localization.RESTART_FILE_FAILED),
    )
  })
})
