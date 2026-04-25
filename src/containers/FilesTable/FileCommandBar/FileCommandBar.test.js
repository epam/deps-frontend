
import { mockEnv } from '@/mocks/mockEnv'
import { screen } from '@testing-library/react'
import { FileStatus } from '@/enums/FileStatus'
import { File, FileState } from '@/models/File'
import { render } from '@/utils/rendererRTL'
import { FileCommandBar } from './FileCommandBar'

jest.mock('@/utils/env', () => mockEnv)

jest.mock('@/containers/DeleteFile', () => ({
  DeleteFile: () => <div data-testid={deleteFileId} />,
}))

const deleteFileId = 'delete-file'

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

test('renders DeleteFile command', () => {
  const props = {
    file: mockFile,
  }

  render(<FileCommandBar {...props} />)

  const deleteCommand = screen.getByTestId(deleteFileId)

  expect(deleteCommand).toBeInTheDocument()
})
