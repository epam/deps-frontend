
import { mockEnv } from '@/mocks/mockEnv'
import { mockNotification } from '@/mocks/mockNotification'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/Modal'
import { FileStatus } from '@/enums/FileStatus'
import { Localization, localize } from '@/localization/i18n'
import { File, FileState } from '@/models/File'
import { render } from '@/utils/rendererRTL'
import { DeleteFile } from './DeleteFile'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/apiRTK/filesApi', () => ({
  useDeleteFilesMutation: jest.fn(() => [
    mockDeleteFiles,
    { isLoading: false },
  ]),
}))

jest.mock('@/utils/notification', () => mockNotification)

jest.mock('@/components/TableActionIcon', () => ({
  TableActionIcon: (props) => <button {...props}>{mockDeleteButton}</button>,
}))

Modal.confirm = jest.fn()

const deleteDocumentTypeUnwrappedFn = jest.fn(() => Promise.resolve())

const mockDeleteFiles = jest.fn(() => ({
  unwrap: deleteDocumentTypeUnwrappedFn,
}))

const mockDeleteButton = 'delete-button'

const mockFile = new File({
  id: '1',
  tenantId: '1',
  name: 'file name',
  path: 'path',
  state: new FileState({
    status: FileStatus.COMPLETED,
    errorMessage: null,
  }),
  createdAt: '2025-07-01T00:00:00.000Z',
  updatedAt: '2025-07-01T00:00:00.000Z',
  labels: [],
})

test('renders delete icon button', () => {
  const defaultProps = {
    file: mockFile,
  }

  render(<DeleteFile {...defaultProps} />)

  const deleteBtn = screen.getByRole('button', { name: mockDeleteButton })

  expect(deleteBtn).toBeInTheDocument()
})

test('calls Modal.confirm with correct arguments in case of delete icon button click', async () => {
  const defaultProps = {
    file: mockFile,
  }

  render(<DeleteFile {...defaultProps} />)

  const deleteBtn = screen.getByRole('button', { name: mockDeleteButton })

  await userEvent.click(deleteBtn)

  expect(Modal.confirm).nthCalledWith(1, {
    title: localize(Localization.DELETE_FILE_CONFIRM_MESSAGE),
    onOk: expect.any(Function),
  })
})

test('calls deleteFiles with correct argument when clicking on modal confirm', async () => {
  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const defaultProps = {
    file: mockFile,
  }

  render(<DeleteFile {...defaultProps} />)

  const deleteBtn = screen.getByRole('button', { name: mockDeleteButton })

  await userEvent.click(deleteBtn)

  expect(mockDeleteFiles).nthCalledWith(1, [defaultProps.file.id])
})

test('calls notifyWarning with correct message in case of delete rejection', async () => {
  jest.clearAllMocks()

  const mockError = new Error('test')
  const mockRejectedUnwrapFn = () => Promise.reject(mockError)
  mockDeleteFiles.mockImplementationOnce(() => ({
    unwrap: mockRejectedUnwrapFn,
  }))

  Modal.confirm.mockImplementationOnce((config) => config.onOk())

  const defaultProps = {
    file: mockFile,
  }

  render(<DeleteFile {...defaultProps} />)

  const deleteBtn = screen.getByRole('button', { name: mockDeleteButton })

  await userEvent.click(deleteBtn)

  expect(mockNotification.notifyWarning).nthCalledWith(
    1,
    localize(Localization.DEFAULT_ERROR),
  )
})

test('renders disabled delete icon button if file is in processing state', async () => {
  const defaultProps = {
    file: {
      ...mockFile,
      state: new FileState({
        status: FileStatus.PROCESSING,
        errorMessage: null,
      }),
    },
  }

  render(<DeleteFile {...defaultProps} />)

  const deleteCommand = screen.getByRole('button', { name: mockDeleteButton })

  expect(deleteCommand).toBeDisabled()
})
